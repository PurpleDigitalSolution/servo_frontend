import { useNavigate } from "react-router-dom";
import { Eye, MapPin, Calendar, UserCheck, UserX } from "lucide-react";

const OrderTable = ({
  paginatedOrders,
  currentPage,
  totalPages,
  onPageChange,
  formatDate,
  formatCurrency,
  getStatusColor,
}: {
  paginatedOrders: any[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  formatDate: (date: Date) => string;
  formatCurrency: (amount: number) => string;
  getStatusColor: (status: string) => string;
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-surface rounded-lg border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <table className="w-full text-xs">
            <thead className="bg-surface-secondary">
              <tr>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Order ID
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Customer
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Station
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Fuel
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Qty
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Price
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Status
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Assigned
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Address
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Created
                </th>
                <th className="px-3 py-2 text-left text-[10px] font-medium text-text-secondary uppercase tracking-wider whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedOrders.map((order) => {
                const isAssigned = !!order.assignedAgentId;
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-secondary transition-colors"
                  >
                    <td className="px-3 py-2 text-[11px] font-medium text-text-primary whitespace-nowrap">
                      <span className="font-mono text-[10px]">
                        {order.id.slice(0, 8)}...
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div>
                          <p className="text-[11px] font-medium text-text-primary leading-tight">
                            {order.customer?.userProfile?.firstName}{" "}
                            {order.customer?.userProfile?.lastName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[11px] text-text-primary whitespace-nowrap">
                      {order.station?.name || "N/A"}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span className="px-1.5 py-0.5 text-[10px] bg-primary/10 text-primary rounded-full">
                        {order.fuelType}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-[11px] text-text-secondary whitespace-nowrap">
                      {order.quantity}L
                    </td>
                    <td className="px-3 py-2 text-[11px] font-medium text-text-primary whitespace-nowrap">
                      {formatCurrency(order.totalAmount)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`px-1.5 py-0.5 text-[10px] rounded-full ${getStatusColor(order.status)}`}
                      >
                        {order.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {isAssigned ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full">
                          <UserCheck size={10} />
                          Assigned
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-full">
                          <UserX size={10} />
                          Unassigned
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-text-secondary whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <MapPin
                          size={12}
                          className="text-text-secondary flex-shrink-0"
                        />
                        <span className="truncate max-w-[120px] text-[10px]">
                          {order.deliveryAddress}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 text-[11px] text-text-secondary whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <Calendar
                          size={12}
                          className="text-text-secondary flex-shrink-0"
                        />
                        <span className="text-[10px]">
                          {formatDate(order.createdAt)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          navigate(`/orders/${order.id}`);
                        }}
                        className="p-1 hover:bg-surface-secondary rounded-lg transition-colors text-text-secondary hover:text-primary"
                        title="View Order"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
          <div className="text-sm text-text-secondary">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-secondary transition-colors text-text-secondary"
            >
              Previous
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-secondary transition-colors text-text-secondary"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;

