
const OrderStats = ({ orders, totalOrders }: { orders: any[]; totalOrders: number }) => {
  // Calculate stats
  const pendingPayment = orders.filter(
    (order) => order.status === "PENDING_PAYMENT"
  ).length;

  const confirmed = orders.filter(
    (order) => order.status === "CONFIRMED"
  ).length;

  const delivered = orders.filter(
    (order) => String(order.status) === "COMPLETED"
  ).length;

  const unassignedCount = orders.filter(
    (order) => !order.assignedAgentId
  ).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
      <div className="bg-surface p-4 rounded-lg border border-border">
        <p className="text-sm text-text-secondary">Total Orders</p>
        <p className="text-2xl font-bold text-text-primary">{totalOrders}</p>
      </div>

      <div className="bg-surface p-4 rounded-lg border border-border">
        <p className="text-sm text-text-secondary">Pending Payment</p>
        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
          {pendingPayment}
        </p>
      </div>

      <div className="bg-surface p-4 rounded-lg border border-border">
        <p className="text-sm text-text-secondary">Confirmed</p>
        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {confirmed}
        </p>
      </div>

      <div className="bg-surface p-4 rounded-lg border border-border">
        <p className="text-sm text-text-secondary">Delivered</p>
        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
          {delivered}
        </p>
      </div>

      <div className="bg-surface p-4 rounded-lg border border-border">
        <p className="text-sm text-text-secondary">Unassigned</p>
        <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {unassignedCount}
        </p>
      </div>
    </div>
  );
};

export default OrderStats;