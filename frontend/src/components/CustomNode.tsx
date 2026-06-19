import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import clsx from 'clsx';
import { Server, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

const CustomNode = ({ data }: { data: any }) => {
  const isFailed = data.status === 'failed';
  const isDegraded = data.status === 'degraded';
  
  // Also handle simulation state: if it's impacted or failed in a simulation
  const simState = data.simulationState; // 'failed' | 'direct' | 'indirect' | null
  
  const isSimFailed = simState === 'failed';
  const isSimDirect = simState === 'direct';
  const isSimIndirect = simState === 'indirect';

  return (
    <div className={clsx(
      "px-4 py-3 shadow-md rounded-lg border-2 bg-white min-w-[180px] transition-all",
      isSimFailed ? "border-red-600 bg-red-50" :
      isSimDirect ? "border-orange-500 bg-orange-50" :
      isSimIndirect ? "border-amber-400 bg-amber-50" :
      isFailed ? "border-red-500" :
      isDegraded ? "border-yellow-500" :
      "border-slate-200"
    )}>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-400" />
      
      <div className="flex items-center gap-2 mb-2">
        {isFailed || isSimFailed ? <ShieldAlert className="w-5 h-5 text-red-500" /> :
         isDegraded || isSimDirect || isSimIndirect ? <AlertTriangle className="w-5 h-5 text-amber-500" /> :
         <CheckCircle className="w-5 h-5 text-emerald-500" />}
        <div className="font-bold text-slate-800 text-sm truncate">{data.name}</div>
      </div>
      
      <div className="text-xs text-slate-500 mb-1">{data.serviceId}</div>
      
      <div className="flex justify-between items-center mt-2">
        <span className="text-[10px] uppercase font-bold text-slate-400">{data.ownerTeam}</span>
        {data.criticality >= 4 && <span className="w-2 h-2 rounded-full bg-red-500" title="High Criticality"></span>}
      </div>

      {simState && (
        <div className={clsx(
          "mt-2 text-[10px] font-bold px-2 py-1 rounded text-center uppercase",
          isSimFailed ? "bg-red-200 text-red-800" :
          isSimDirect ? "bg-orange-200 text-orange-800" :
          "bg-amber-200 text-amber-800"
        )}>
          {isSimFailed ? 'Failed Source' : `${simState} Impact`}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-400" />
    </div>
  );
};

export default memo(CustomNode);
