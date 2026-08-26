import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DiscoveryAnswer, DiscoveryQuestion, Recommendation } from '@/types';
import {
  DISCOVERY_ROOT,
  discoveryQuestions,
  fallbackRecommendation,
  recommendationRules,
} from '@/data/discovery';
import { getPortfolioByTags, getService, getSpecialistsForService } from '@/data';
import { track } from '@/lib/analytics';
import { unique } from '@/lib/utils';

/**
 * Discovery state machine.
 *
 * Answers accumulate tags; the first rule whose requirements are all present
 * wins. Because rules are ordered most-specific-first, «свадьба + невеста»
 * resolves to the bridal package while a plain «свадьба» still resolves to
 * something sensible — the flow can never dead-end on an unhandled combination.
 */

const questionIndex = new Map(discoveryQuestions.map((question) => [question.id, question]));

export interface DiscoveryState {
  question: DiscoveryQuestion | null;
  answers: DiscoveryAnswer[];
  /** 1-based, for the "Шаг 2 из 3" indicator. */
  step: number;
  /** Upper bound on remaining steps along the current branch. */
  totalSteps: number;
  recommendation: Recommendation | null;
  select: (optionId: string) => void;
  back: () => void;
  restart: () => void;
  done: boolean;
}

/** Longest path from a question to a terminal option — bounded by design at 3. */
function depthFrom(questionId: string, seen = new Set<string>()): number {
  if (seen.has(questionId)) return 0;
  seen.add(questionId);
  const question = questionIndex.get(questionId);
  if (!question) return 0;
  return (
    1 +
    Math.max(
      0,
      ...question.options.map((option) => (option.next ? depthFrom(option.next, new Set(seen)) : 0)),
    )
  );
}

export function useDiscovery(startTag?: string): DiscoveryState {
  const [path, setPath] = useState<string[]>([DISCOVERY_ROOT]);
  const [answers, setAnswers] = useState<DiscoveryAnswer[]>([]);
  const [started, setStarted] = useState(false);

  const currentId = path[path.length - 1] ?? null;
  const question = currentId ? (questionIndex.get(currentId) ?? null) : null;

  const tags = useMemo(() => {
    const collected = answers.flatMap((answer) => {
      const source = questionIndex.get(answer.questionId);
      return source?.options.find((option) => option.id === answer.optionId)?.tags ?? [];
    });
    return unique(startTag ? [startTag, ...collected] : collected);
  }, [answers, startTag]);

  const select = useCallback(
    (optionId: string) => {
      if (!question) return;
      const option = question.options.find((candidate) => candidate.id === optionId);
      if (!option) return;

      if (!started) {
        setStarted(true);
        track('discovery_started', { entry: question.id });
      }
      track('discovery_answered', { question: question.id, option: option.id });

      setAnswers((previous) => [
        ...previous.filter((answer) => answer.questionId !== question.id),
        { questionId: question.id, optionId },
      ]);
      setPath((previous) => (option.next ? [...previous, option.next] : [...previous, '']));
    },
    [question, started],
  );

  const back = useCallback(() => {
    setPath((previous) => (previous.length > 1 ? previous.slice(0, -1) : previous));
    setAnswers((previous) => previous.slice(0, -1));
  }, []);

  const restart = useCallback(() => {
    setPath([DISCOVERY_ROOT]);
    setAnswers([]);
  }, []);

  const done = currentId === '';

  const recommendation = useMemo(
    () => (done ? resolveRecommendation(tags) : null),
    [done, tags],
  );

  // Reporting lives outside the memo: deriving a recommendation must stay pure.
  useEffect(() => {
    if (!recommendation) return;
    track('discovery_completed', {
      recommendation: recommendation.title,
      tags: recommendation.tags.join(','),
    });
  }, [recommendation]);

  return {
    question,
    answers,
    step: answers.length + 1,
    totalSteps: answers.length + (question ? depthFrom(question.id) : 0),
    recommendation,
    select,
    back,
    restart,
    done,
  };
}

/** Exported so a deep link can resolve a recommendation without running the flow. */
export function resolveRecommendation(tags: string[]): Recommendation {
  const rule =
    recommendationRules.find((candidate) =>
      candidate.requires.every((required) => tags.includes(required)),
    ) ?? fallbackRecommendation;

  const services = rule.serviceIds
    .map((id) => getService(id))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));

  const primary = services[0];
  const specialistIds = unique(
    services.flatMap((service) => getSpecialistsForService(service.id).map((s) => s.id)),
  );

  const portfolioIds = getPortfolioByTags(
    unique([...rule.portfolioTags, ...services.flatMap((service) => service.tags)]),
    4,
  ).map((item) => item.id);

  return {
    title: rule.title,
    rationale: rule.rationale,
    serviceIds: services.map((service) => service.id),
    specialistIds,
    portfolioIds,
    priceFrom: primary?.price.from ?? 0,
    duration: primary?.duration ?? { min: 60 },
    tags: unique([...tags, ...rule.portfolioTags]),
  };
}
