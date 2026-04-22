import { displayAmount } from "../../lib/formatters";
import type { DisplayValue } from "../../types/app";

interface MetricProps {
  label: string;
  value: DisplayValue;
  note: string;
}

interface BannerStatProps {
  label: string;
  value: DisplayValue;
  note: string;
}

interface InfoPillProps {
  label: string;
  value: DisplayValue;
}

interface FeatureCardProps {
  title: string;
  copy: string;
}

interface PackageCardProps {
  title: string;
  value: number;
  caption: string;
}

export function Metric({ label, value, note }: MetricProps) {
  return (
    <div className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </div>
  );
}

export function BannerStat({ label, value, note }: BannerStatProps) {
  return (
    <article className="banner-stat">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{note}</small>
    </article>
  );
}

export function InfoPill({ label, value }: InfoPillProps) {
  return (
    <div className="info-pill">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

export function FeatureCard({ title, copy }: FeatureCardProps) {
  return (
    <article className="feature-card">
      <h4>{title}</h4>
      <p>{copy}</p>
    </article>
  );
}

export function PackageCard({ title, value, caption }: PackageCardProps) {
  return (
    <div className="package-card">
      <h4>{title}</h4>
      <strong>{displayAmount(value)}</strong>
      <p>{caption}</p>
    </div>
  );
}
