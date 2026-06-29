import PackageSelectionWidget from './product/PackageSelectionWidget';

export default function TicketBookingWidget({ ticketTypes = [], product }: { ticketTypes?: any[]; product?: any }) {
  return <PackageSelectionWidget ticketTypes={ticketTypes} product={product} />;
}
