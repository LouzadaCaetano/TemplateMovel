import React, { useState } from 'react';
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

  if (screen.name === 'form') {
    return (
      <BudgetForm
        orcamentoId={screen.orcamentoId}
        onBack={() => setScreen({ name: 'home' })}
        onSaved={() => {
          setReloadSignal((currentValue) => currentValue + 1);
          setScreen({ name: 'home' });
        }}
      />
    );
  }

  if (screen.name === 'details') {
    return (
      <BudgetDetails
        orcamentoId={screen.orcamentoId}
        onBack={() => setScreen({ name: 'home' })}
        onEdit={(orcamentoId) => setScreen({ name: 'form', orcamentoId })}
        onRefresh={() => setReloadSignal((currentValue) => currentValue + 1)}
      />
    );
  }

  return (
    <Home
      reloadSignal={reloadSignal}
      onCreate={() => setScreen({ name: 'form', orcamentoId: null })}
      onEdit={(orcamentoId) => setScreen({ name: 'form', orcamentoId })}
      onOpenDetails={(orcamentoId) => setScreen({ name: 'details', orcamentoId })}
    />
  );
}
