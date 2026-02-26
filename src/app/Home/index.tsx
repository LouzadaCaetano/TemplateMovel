import { StyleSheet, View, Image, Text } from 'react-native';
import { styles } from './styles';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Filter } from '@/components/Filter';
import { Feather } from '@expo/vector-icons';
import { BudgetCard } from '@/components/BudgetCard';
import { Orcamento } from '@/types/ModeloOrcamento';
import { StatusOrcamento } from '@/types/StatusOrcamento';


export default function Home() {
  const orcamentos: Orcamento[] = [
    {
      id: '1',
      cliente: 'ACME Ltda',
      titulo: 'Orçamento de TI',
      itens: [{ id: 'i1', descricao: 'Serviço A', quantidade: 1, precoUnitario: 1550 }],
      percentualDesconto: 0,
      status: 'Rascunho',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    },
    {
      id: '2',
      cliente: 'Beta SA',
      titulo: 'Evento Corporativo',
      itens: [{ id: 'i2', descricao: 'Serviço B', quantidade: 2, precoUnitario: 2725 }],
      status: 'Enviado',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    },
    {
      id: '3',
      cliente: 'Gamma ME',
      titulo: 'Atualização de Sistema',
      itens: [{ id: 'i3', descricao: 'Serviço C', quantidade: 2, precoUnitario: 1820 }],
      status: 'Aprovado',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    },
    {
      id: '4',
      cliente: 'Delta Ltda',
      titulo: 'Manutenção',
      itens: [{ id: 'i4', descricao: 'Serviço D', quantidade: 4, precoUnitario: 150 }],
      status: 'Recusado',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
    },
  ];

  return (

      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Orçamentos</Text>
        <Button title="Adicionar" />
      </View>

      <View style={styles.form}>
        <View style={styles.searchRow}>
          <Input placeholder="Título ou cliente..." />
          <Button
            icon={<Feather name="filter" size={20} color="#fff" />}
          />
        </View>
      </View>

      <View style={styles.list}>
        {orcamentos.map(o => (
          <BudgetCard key={o.id} orcamento={o} />
        ))}
      </View>

    </View>
  );
}
