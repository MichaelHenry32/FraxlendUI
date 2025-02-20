import { ActionType } from '@/lib/hooks/useMarketActions';

interface ActionTabsProps {
  selectedAction: ActionType;
  onActionSelect: (action: ActionType) => void;
}

function ActionTab({ type, active, onClick }: { type: ActionType; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : 'text-gray-600 hover:text-gray-900'
      }`}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </button>
  );
}

export function ActionTabs({ selectedAction, onActionSelect }: ActionTabsProps) {
  return (
    <div className="flex space-x-2 border-b border-gray-200 pb-2">
      <ActionTab 
        type="lend" 
        active={selectedAction === 'lend'} 
        onClick={() => onActionSelect('lend')} 
      />
      <ActionTab 
        type="withdraw" 
        active={selectedAction === 'withdraw'} 
        onClick={() => onActionSelect('withdraw')} 
      />
      <ActionTab 
        type="repay" 
        active={selectedAction === 'repay'} 
        onClick={() => onActionSelect('repay')} 
      />
      <ActionTab 
        type="borrow" 
        active={selectedAction === 'borrow'} 
        onClick={() => onActionSelect('borrow')} 
      />
    </div>
  );
} 