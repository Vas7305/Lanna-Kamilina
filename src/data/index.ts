/**
 * Content repository.
 *
 * The only module the UI imports content from. Everything here is a pure
 * synchronous read over the mock modules today; when a CMS or a booking system
 * arrives, these functions become the async adapters and no component changes
 * its shape.
 */

import type {
  PortfolioItem,
  Review,
  Service,
  ServiceCategory,
  ServiceCategoryId,
  Specialist,
} from '@/types';
import { byId, unique } from '@/lib/utils';

import { services, serviceCategories } from './services';
import { specialists } from './specialists';
import { portfolio, portfolioFilters } from './portfolio';
import { reviews, reputation } from './reviews';
import { business, placeholders, yearsInBusiness, IS_DEMO_CONTENT, CONTENT_MODE } from './business';

export {
  services,
  serviceCategories,
  specialists,
  portfolio,
  portfolioFilters,
  reviews,
  reputation,
  business,
  placeholders,
  yearsInBusiness,
  IS_DEMO_CONTENT,
  CONTENT_MODE,
};

const serviceIndex = byId(services);
const specialistIndex = byId(specialists);
const portfolioIndex = byId(portfolio);
const reviewIndex = byId(reviews);

/* ---------------------------------------------------------------- services */

export function getService(id: string): Service | undefined {
  return serviceIndex.get(id);
}

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}

export function getServices(ids: string[]): Service[] {
  return ids.map((id) => serviceIndex.get(id)).filter((s): s is Service => Boolean(s));
}

export function getCategory(id: ServiceCategoryId): ServiceCategory | undefined {
  return serviceCategories.find((category) => category.id === id);
}

export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((category) => category.slug === slug);
}

export function getServicesByCategory(id: ServiceCategoryId): Service[] {
  return services.filter((service) => service.categoryId === id);
}

export function getFeaturedServices(limit = 6): Service[] {
  return services.filter((service) => service.featured).slice(0, limit);
}

/** Services sharing a tag — powers "похожие услуги" without manual curation. */
export function getRelatedServices(service: Service, limit = 3): Service[] {
  return services
    .filter((candidate) => candidate.id !== service.id)
    .map((candidate) => ({
      candidate,
      score: candidate.tags.filter((tag) => service.tags.includes(tag)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

/* ------------------------------------------------------------- specialists */

export function getSpecialist(id: string): Specialist | undefined {
  return specialistIndex.get(id);
}

export function getSpecialistBySlug(slug: string): Specialist | undefined {
  return specialists.find((specialist) => specialist.slug === slug);
}

export function getSpecialists(ids: string[]): Specialist[] {
  return ids.map((id) => specialistIndex.get(id)).filter((s): s is Specialist => Boolean(s));
}

export function getSpecialistsForService(serviceId: string): Specialist[] {
  return specialists.filter(
    (specialist) => specialist.acceptingBookings && specialist.serviceIds.includes(serviceId),
  );
}

export function getServicesForSpecialist(specialistId: string): Service[] {
  const specialist = specialistIndex.get(specialistId);
  if (!specialist) return [];
  return getServices(specialist.serviceIds);
}

/* --------------------------------------------------------------- portfolio */

export function getPortfolioItem(id: string): PortfolioItem | undefined {
  return portfolioIndex.get(id);
}

export function getPortfolioItemBySlug(slug: string): PortfolioItem | undefined {
  return portfolio.find((item) => item.slug === slug);
}

export function getPortfolioItems(ids: string[]): PortfolioItem[] {
  return ids.map((id) => portfolioIndex.get(id)).filter((p): p is PortfolioItem => Boolean(p));
}

export interface PortfolioFilter {
  tag?: string;
  specialistId?: string;
  serviceId?: string;
  withBeforeAfter?: boolean;
}

export function filterPortfolio(filter: PortfolioFilter = {}): PortfolioItem[] {
  return portfolio.filter((item) => {
    if (filter.tag && !item.tags.includes(filter.tag)) return false;
    if (filter.specialistId && item.specialistId !== filter.specialistId) return false;
    if (filter.serviceId && !item.serviceIds.includes(filter.serviceId)) return false;
    if (filter.withBeforeAfter && !item.beforeAfter) return false;
    return true;
  });
}

export function getFeaturedPortfolio(limit = 8): PortfolioItem[] {
  const featured = portfolio.filter((item) => item.featured);
  return [...featured, ...portfolio.filter((item) => !item.featured)].slice(0, limit);
}

export function getPortfolioForService(serviceId: string, limit = 6): PortfolioItem[] {
  const service = serviceIndex.get(serviceId);
  const direct = filterPortfolio({ serviceId });
  if (direct.length >= limit || !service) return direct.slice(0, limit);

  // Fall back to tag overlap so a rarely photographed service still shows proof.
  const byTag = portfolio.filter(
    (item) =>
      !direct.includes(item) && item.tags.some((tag) => service.tags.includes(tag)),
  );
  return [...direct, ...byTag].slice(0, limit);
}

export function getPortfolioByTags(tags: string[], limit = 6): PortfolioItem[] {
  if (tags.length === 0) return getFeaturedPortfolio(limit);
  return portfolio
    .map((item) => ({ item, score: item.tags.filter((tag) => tags.includes(tag)).length }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || Number(Boolean(b.item.featured)) - Number(Boolean(a.item.featured)))
    .slice(0, limit)
    .map((entry) => entry.item);
}

export function getBeforeAfterItems(limit = 6): PortfolioItem[] {
  return portfolio.filter((item) => item.beforeAfter).slice(0, limit);
}

/* ----------------------------------------------------------------- reviews */

export function getReview(id: string): Review | undefined {
  return reviewIndex.get(id);
}

export function getReviewsForService(serviceId: string, limit = 3): Review[] {
  return reviews.filter((review) => review.serviceIds?.includes(serviceId)).slice(0, limit);
}

export function getReviewsForSpecialist(specialistId: string, limit = 3): Review[] {
  return reviews.filter((review) => review.specialistId === specialistId).slice(0, limit);
}

export function getReviewForPortfolioItem(item: PortfolioItem): Review | undefined {
  if (item.reviewId) return reviewIndex.get(item.reviewId);
  return reviews.find((review) => review.portfolioItemId === item.id);
}

/** General-purpose reviews for the reputation strip, newest first. */
export function getRecentReviews(limit = 6): Review[] {
  return [...reviews].sort((a, b) => b.date.localeCompare(a.date)).slice(0, limit);
}

export function getTotalReviewCount(): number {
  return reputation.reduce((sum, item) => sum + item.rating.count, 0);
}

export function getAverageRating(): number {
  const totalWeight = reputation.reduce((sum, item) => sum + item.rating.count, 0);
  if (!totalWeight) return 0;
  const weighted = reputation.reduce(
    (sum, item) => sum + item.rating.value * item.rating.count,
    0,
  );
  return Math.round((weighted / totalWeight) * 10) / 10;
}

/* ------------------------------------------------------------------- misc */

/** All tags in use — keeps filter UIs from listing tags nothing matches. */
export function getActivePortfolioFilters() {
  const used = new Set(portfolio.flatMap((item) => item.tags));
  return portfolioFilters.filter((filter) => used.has(filter.tag));
}

export function getAllServiceTags(): string[] {
  return unique(services.flatMap((service) => service.tags));
}
