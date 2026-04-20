import React, { useCallback, useState } from 'react';
import Home from '@/app/Home';
import BudgetDetails from '@/app/BudgetDetails';
import BudgetForm from '@/app/BudgetForm';

type ScreenState =
  | { name: 'home' }
  | { name: 'form'; orcamentoId?: string | null }
  | { name: 'details'; orcamentoId: string };

export default function App() {
  const [screen, setScreen] = useState<ScreenState>({ name: 'home' });
  const [reloadSignal, setReloadSignal] = useState(0);
  const refreshHome = useCallback(() => {
    setReloadSignal((currentValue) => currentValue + 1);
  }, []);
  const navigateHome = useCallback(() => {
    setScreen({ name: 'home' });
  }, []);
  const openForm = useCallback((orcamentoId?: string | null) => {
    setScreen({ name: 'form', orcamentoId });
  }, []);
  const openDetails = useCallback((orcamentoId: string) => {
    setScreen({ name: 'details', orcamentoId });
  }, []);

  if (screen.name === 'form') {
    return (
      <BudgetForm
        orcamentoId={screen.orcamentoId}
        onBack={navigateHome}
        onSaved={() => {
          refreshHome();
          navigateHome();
        }}
      />
    );
  }

  if (screen.name === 'details') {
    return (
      <BudgetDetails
        orcamentoId={screen.orcamentoId}
        onBack={navigateHome}
        onEdit={openForm}
        onRefresh={refreshHome}
      />
    );
  }

  return (
    <Home
      reloadSignal={reloadSignal}
      onCreate={() => openForm(null)}
      onEdit={openForm}
      onOpenDetails={openDetails}
    />
  );
}
