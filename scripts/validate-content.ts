/**
 * Content integrity check.
 *
 * The catalogue is hand-authored data, and a dangling id fails silently in the
 * UI — a service with no bookable specialist, a portfolio card crediting a
 * master who no longer exists, a discovery branch recommending a deleted
 * service. This script turns all of that into a build-time error.
 *
 * Run with: npm run validate
 */

import {
  portfolio,
  reviews,
  serviceCategories,
  services,
  specialists,
} from '../src/data/index';
import { discoveryQuestions, fallbackRecommendation, recommendationRules } from '../src/data/discovery';
import { routes } from '../src/lib/routes';

const problems: string[] = [];

function check(condition: boolean, message: string) {
  if (!condition) problems.push(message);
}

const serviceIds = new Set(services.map((s) => s.id));
const specialistIds = new Set(specialists.map((s) => s.id));
const portfolioIds = new Set(portfolio.map((p) => p.id));
const reviewIds = new Set(reviews.map((r) => r.id));
const categoryIds = new Set(serviceCategories.map((c) => c.id));

/* -------------------------------------------------------------- uniqueness */

function assertUniqueSlugs(name: string, items: Array<{ slug: string }>) {
  const seen = new Set<string>();
  for (const item of items) {
    check(!seen.has(item.slug), `${name}: duplicate slug "${item.slug}"`);
    seen.add(item.slug);
  }
}

assertUniqueSlugs('services', services);
assertUniqueSlugs('specialists', specialists);
assertUniqueSlugs('portfolio', portfolio);
assertUniqueSlugs('categories', serviceCategories);

/* ------------------------------------------------------------- references */

for (const service of services) {
  check(categoryIds.has(service.categoryId), `service ${service.id}: unknown category ${service.categoryId}`);
  check(
    service.specialistIds.length > 0,
    `service ${service.id}: no specialists — it would render as unbookable`,
  );
  for (const id of service.specialistIds) {
    check(specialistIds.has(id), `service ${service.id}: unknown specialist ${id}`);
  }
  // A service must be reachable from the specialist side too, or the booking
  // flow will offer a master who then has no availability for it.
  for (const id of service.specialistIds) {
    const specialist = specialists.find((s) => s.id === id);
    check(
      Boolean(specialist?.serviceIds.includes(service.id)),
      `service ${service.id}: specialist ${id} does not list it back`,
    );
  }
  check(service.price.from > 0, `service ${service.id}: price.from must be positive`);
  check(service.duration.min > 0, `service ${service.id}: duration.min must be positive`);
  check(
    !service.duration.max || service.duration.max >= service.duration.min,
    `service ${service.id}: duration.max is below duration.min`,
  );
}

for (const specialist of specialists) {
  for (const id of specialist.serviceIds) {
    check(serviceIds.has(id), `specialist ${specialist.id}: unknown service ${id}`);
  }
}

for (const item of portfolio) {
  check(specialistIds.has(item.specialistId), `portfolio ${item.id}: unknown specialist`);
  check(item.serviceIds.length > 0, `portfolio ${item.id}: no linked service — the card cannot convert`);
  for (const id of item.serviceIds) {
    check(serviceIds.has(id), `portfolio ${item.id}: unknown service ${id}`);
  }
  if (item.reviewId) {
    check(reviewIds.has(item.reviewId), `portfolio ${item.id}: unknown review ${item.reviewId}`);
  }
  check(Boolean(item.image.alt), `portfolio ${item.id}: image is missing alt text`);
  if (item.beforeAfter) {
    check(
      Boolean(item.beforeAfter.before.alt && item.beforeAfter.after.alt),
      `portfolio ${item.id}: before/after images need alt text`,
    );
  }
}

for (const review of reviews) {
  if (review.specialistId) {
    check(specialistIds.has(review.specialistId), `review ${review.id}: unknown specialist`);
  }
  for (const id of review.serviceIds ?? []) {
    check(serviceIds.has(id), `review ${review.id}: unknown service ${id}`);
  }
  if (review.portfolioItemId) {
    check(portfolioIds.has(review.portfolioItemId), `review ${review.id}: unknown portfolio item`);
  }
  check(review.rating >= 1 && review.rating <= 5, `review ${review.id}: rating out of range`);
}

/* -------------------------------------------------------------- discovery */

const questionIds = new Set(discoveryQuestions.map((q) => q.id));

for (const question of discoveryQuestions) {
  check(question.options.length > 1, `discovery ${question.id}: needs at least two options`);
  for (const option of question.options) {
    if (option.next) {
      check(questionIds.has(option.next), `discovery ${question.id}/${option.id}: unknown next ${option.next}`);
    }
  }
}

/** No branch may exceed three questions — that is the product constraint. */
function longestPath(questionId: string, depth = 1, seen: string[] = []): number {
  check(!seen.includes(questionId), `discovery: cycle through ${questionId}`);
  const question = discoveryQuestions.find((q) => q.id === questionId);
  if (!question) return depth;
  return Math.max(
    ...question.options.map((option) =>
      option.next ? longestPath(option.next, depth + 1, [...seen, questionId]) : depth,
    ),
  );
}

const depth = longestPath('start');
check(depth <= 3, `discovery: longest branch is ${depth} questions, maximum is 3`);

for (const rule of [...recommendationRules, fallbackRecommendation]) {
  check(rule.serviceIds.length > 0, `recommendation ${rule.id}: recommends nothing`);
  for (const id of rule.serviceIds) {
    check(serviceIds.has(id), `recommendation ${rule.id}: unknown service ${id}`);
  }
}

/** Every terminal option must resolve to a rule, or the flow dead-ends. */
function tagsAlongPaths(questionId: string, carried: string[], out: string[][]) {
  const question = discoveryQuestions.find((q) => q.id === questionId);
  if (!question) return;
  for (const option of question.options) {
    const tags = [...carried, ...option.tags];
    if (option.next) tagsAlongPaths(option.next, tags, out);
    else out.push(tags);
  }
}

const terminalTagSets: string[][] = [];
tagsAlongPaths('start', [], terminalTagSets);

for (const tags of terminalTagSets) {
  const matched =
    recommendationRules.some((rule) => rule.requires.every((tag) => tags.includes(tag))) ||
    fallbackRecommendation.requires.length === 0;
  check(matched, `discovery: path [${tags.join(', ')}] resolves to no recommendation`);
}

/* --------------------------------------------------- hard-coded deep links */

/** Links written by hand in sections must point at services that exist. */
const hardCodedServiceLinks = ['svadebnyy-obraz', 'obraz-dlya-fotosessii', 'vecherniy-obraz'];
for (const slug of hardCodedServiceLinks) {
  check(
    services.some((service) => service.slug === slug),
    `sections/Offering: link to /uslugi/${slug} has no matching service`,
  );
}

check(routes.home === '/', 'routes: home must be "/"');

/* ----------------------------------------------------------------- report */

if (problems.length > 0) {
  console.error(`\n✗ ${problems.length} content problem(s):\n`);
  problems.forEach((problem) => console.error(`  · ${problem}`));
  process.exit(1);
}

console.log(
  `✓ content OK — ${services.length} services, ${specialists.length} specialists, ` +
    `${portfolio.length} works, ${reviews.length} reviews, discovery depth ${depth}`,
);
