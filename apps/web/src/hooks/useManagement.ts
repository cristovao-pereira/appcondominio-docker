import { useState } from 'react';
import { mockVisitors, mockBlocks, mockAuthorizations } from '@/data/mockData';
import type { Authorization } from '@/types';

export function useManagement() {
  const [authorizations, setAuthorizations] = useState(mockAuthorizations);

  const approveAuthorization = (id: string) => {
    setAuthorizations(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'approved' as Authorization['status'] } : a))
    );
  };

  const refuseAuthorization = (id: string) => {
    setAuthorizations(prev =>
      prev.map(a => (a.id === id ? { ...a, status: 'refused' as Authorization['status'] } : a))
    );
  };

  return {
    visitors: mockVisitors,
    blocks: mockBlocks,
    authorizations,
    loading: false,
    approveAuthorization,
    refuseAuthorization,
  };
}

