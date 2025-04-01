import { Clock, Package, Star, Calendar } from "lucide-react";

interface UserActivityCardProps {
  joinDate: string;
  orderCount?: number;
  wishlistCount?: number;
  reviewCount?: number;
}

export function UserActivityCard({
  joinDate,
  orderCount = 0,
  wishlistCount = 0,
  reviewCount = 0
}: UserActivityCardProps) {
  // Format join date
  const formattedDate = new Date(joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const activityItems = [
    {
      icon: Calendar,
      label: "Joined",
      value: formattedDate
    },
    {
      icon: Package,
      label: "Orders",
      value: orderCount.toString()
    },
    {
      icon: Star,
      label: "Reviews",
      value: reviewCount.toString()
    },
    {
      icon: Clock,
      label: "In Wishlist",
      value: wishlistCount.toString()
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-xl font-semibold mb-4">Account Activity</h2>
      
      <div className="grid grid-cols-2 gap-4">
        {activityItems.map((item, index) => (
          <div key={index} className="flex flex-col p-3 rounded-lg bg-gray-50">
            <div className="flex items-center mb-2">
              <item.icon size={16} className="mr-2 text-primary" />
              <span className="text-sm text-gray-600">{item.label}</span>
            </div>
            <div className="font-medium text-gray-900">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 