import { DiscoveryEngine } from '@/features/discovery/DiscoveryEngine';

/**
 * Discovery on the homepage.
 *
 * Placed immediately after the hero because the largest segment of traffic
 * arrives knowing they want to look better without knowing what to book. The
 * engine runs inline — sending someone to a separate page to answer two
 * questions is friction with no payoff.
 */
export function DiscoverySection() {
  return (
    <section className="section-y bg-paper-2/70" aria-labelledby="discovery-heading">
      <div className="shell">
        <h2 id="discovery-heading" className="sr-only">
          Подбор образа
        </h2>
        <DiscoveryEngine compact />
      </div>
    </section>
  );
}
