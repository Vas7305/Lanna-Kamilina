import { routes } from '@/lib/routes';
import { formatYears } from '@/lib/format';
import { yearsInBusiness } from '@/data';
import { experiencePillars, milestones, proofPoints } from '@/data/story';
import { SectionHeader } from '@/components/Typo';
import { TextLink } from '@/components/Button';
import { Figure } from '@/components/Figure';
import { Reveal } from '@/components/Reveal';

/**
 * Heritage.
 *
 * Longevity is the one advantage a new competitor cannot buy, so it gets an
 * editorial timeline rather than a paragraph of corporate history. The message
 * is not "we are old" but "experience is why the prediction is reliable".
 */
export function HeritageSection() {
  return (
    <section className="section-y" aria-labelledby="heritage-heading">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeader
              eyebrow="Наследие"
              title={
                <>
                  С 1999 года
                  <br />
                  в Москве
                </>
              }
              lead={`${formatYears(yearsInBusiness)} — это не строчка в описании. Это причина, по которой мастер может сказать заранее, что получится, а что нет.`}
            />

            <div className="mt-10">
              <Figure
                image={{ src: '/Lanna Kamilina/Places/2.jpeg', alt: 'Интерьер салона Lanna Kamilina', seed: 'heritage-interior' }}
                ratio="landscape"
                className="grain"
              />
            </div>
          </div>

          <ol className="lg:col-span-6 lg:col-start-7">
            {milestones.map((milestone, index) => (
              <Reveal as="li" key={milestone.marker} delay={index * 60} className="block">
                <div className="grid grid-cols-[5.5rem_1fr] gap-6 border-t border-line py-8 sm:grid-cols-[7rem_1fr]">
                  <span className="numeric type-meta pt-1 text-accent uppercase">
                    {milestone.marker}
                  </span>
                  <div>
                    <h3 className="type-subtitle">{milestone.title}</h3>
                    <p className="type-body mt-3 text-ink-2">{milestone.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/**
 * The experience.
 *
 * What actually happens during a visit, told as four concrete commitments
 * instead of adjectives. "Честный прогноз" is checkable; "незабываемый опыт"
 * is not.
 */
export function ExperienceSection() {
  return (
    <section className="section-y bg-paper-2/70" aria-labelledby="experience-heading">
      <div className="shell">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
              <SectionHeader
                eyebrow="Опыт визита"
                title="Больше, чем процедура"
                lead="Разница между хорошим салоном и обычным — не в оборудовании, а в том, что происходит до того, как мастер возьмёт ножницы."
                action={<TextLink to={routes.about}>О салоне</TextLink>}
              />
            </div>
          </div>

          <div className="grid gap-px bg-line sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
            {experiencePillars.map((pillar, index) => (
              <Reveal key={pillar.title} delay={(index % 2) * 60}>
                <div className="flex h-full flex-col bg-paper-2 p-7">
                  <h3 className="type-subtitle">{pillar.title}</h3>
                  <p className="type-small mt-4 text-ink-2">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Compact proof strip — four facts, each verifiable elsewhere on the site. */
export function ProofStrip() {
  return (
    <section className="hairline" aria-label="Коротко о салоне">
      <div className="shell grid grid-cols-2 gap-px bg-line sm:grid-cols-4">
        {proofPoints.map((point) => (
          <div key={point.label} className="flex flex-col gap-1 bg-paper px-1 py-8 text-center">
            <span className="numeric type-title font-display">{point.value}</span>
            <span className="type-meta text-muted">{point.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
