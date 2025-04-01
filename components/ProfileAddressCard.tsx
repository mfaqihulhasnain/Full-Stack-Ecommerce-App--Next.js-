import { Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Address {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

interface ProfileAddressCardProps {
  addresses: Address[];
  onAddAddress?: () => void;
  onEditAddress?: (id: string) => void;
}

export function ProfileAddressCard({
  addresses = [],
  onAddAddress,
  onEditAddress
}: ProfileAddressCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Shipping Addresses</h2>
        <Button 
          onClick={onAddAddress} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus size={14} />
          Add Address
        </Button>
      </div>
      
      {addresses.length === 0 ? (
        <div className="p-6 text-center bg-gray-50 rounded-lg">
          <Home className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <h3 className="font-medium text-gray-900">No addresses found</h3>
          <p className="text-gray-500 text-sm mt-1">
            You haven't added any shipping addresses yet.
          </p>
          <Button 
            onClick={onAddAddress} 
            variant="outline"
            className="mt-3"
          >
            Add Your First Address
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div 
              key={address.id} 
              className={`p-4 border rounded-lg relative ${address.isDefault ? 'border-primary/30 bg-primary/5' : ''}`}
            >
              {address.isDefault && (
                <span className="absolute right-4 top-4 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Default
                </span>
              )}
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{address.title}</h3>
                <Button 
                  onClick={() => onEditAddress?.(address.id)} 
                  variant="ghost" 
                  size="sm"
                  className="text-xs"
                >
                  Edit
                </Button>
              </div>
              <div className="text-sm text-gray-600">
                <p>{address.address}</p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 