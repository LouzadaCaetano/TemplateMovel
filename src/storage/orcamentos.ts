import AsyncStorage from '@react-native-async-storage/async-storage';
import { Orcamento } from '@/types/ModeloOrcamento';
import { canUpdateStatus, StatusOrcamento } from '@/types/StatusOrcamento';

// Chave usada para salvar os orcamentos no celular.
const ORCAMENTOS_STORAGE_KEY = '@templatemovel:orcamentos';

// Busca todos os orcamentos salvos.
export async function getAll(): Promise<Orcamento[]> {
  const stored = await AsyncStorage.getItem(ORCAMENTOS_STORAGE_KEY);

  if (!stored) {
    return [];
  }

  return JSON.parse(stored) as Orcamento[];
}

// Busca um unico orcamento pelo id.
export async function getById(id: string): Promise<Orcamento | null> {
  const orcamentos = await getAll();

  return orcamentos.find((item) => item.id === id) ?? null;
}

// Busca apenas os orcamentos do status informado.
export async function getByStatus(
  status: StatusOrcamento,
  source?: Orcamento[]
): Promise<Orcamento[]> {
  const orcamentos = source ?? await getAll();

  return orcamentos.filter((item) => item.status === status);
}

// Salva a lista completa de orcamentos.
export async function saveAll(orcamentos: Orcamento[]): Promise<void> {
  await AsyncStorage.setItem(
    ORCAMENTOS_STORAGE_KEY,
    JSON.stringify(orcamentos)
  );
}

// Adiciona um novo orcamento na lista persistida.
export async function add(
  orcamento: Orcamento,
  source?: Orcamento[]
): Promise<Orcamento[]> {
  const orcamentos = source ?? await getAll();
  const updatedOrcamentos = [...orcamentos, orcamento];

  await saveAll(updatedOrcamentos);

  return updatedOrcamentos;
}

// Atualiza um orcamento completo pelo id.
export async function update(
  id: string,
  updatedOrcamento: Orcamento,
  source?: Orcamento[]
): Promise<Orcamento[]> {
  const orcamentos = source ?? await getAll();
  let itemEncontrado = false;

  const updatedOrcamentos = orcamentos.map((item) => {
    if (item.id !== id) {
      return item;
    }

    itemEncontrado = true;

    return {
      ...updatedOrcamento,
      id,
      dataCriacao: item.dataCriacao,
      dataAtualizacao: new Date().toISOString(),
    };
  });

  if (!itemEncontrado) {
    throw new Error('ORCAMENTO_NOT_FOUND');
  }

  await saveAll(updatedOrcamentos);

  return updatedOrcamentos;
}

// Remove um orcamento pelo id.
export async function remove(
  id: string,
  source?: Orcamento[]
): Promise<Orcamento[]> {
  const orcamentos = source ?? await getAll();
  const updatedOrcamentos = orcamentos.filter((item) => item.id !== id);

  await saveAll(updatedOrcamentos);

  return updatedOrcamentos;
}

// Limpa todos os orcamentos salvos.
export async function clear(): Promise<void> {
  await AsyncStorage.removeItem(ORCAMENTOS_STORAGE_KEY);
}

// Atualiza o status de um orcamento pelo id.
export async function updateStatus(
  id: string,
  newStatus: StatusOrcamento,
  source?: Orcamento[]
): Promise<Orcamento[]> {
  const orcamentos = source ?? await getAll();
  let itemEncontrado = false;

  const updatedOrcamentos = orcamentos.map((item) => {
    if (item.id !== id) {
      return item;
    }

    itemEncontrado = true;

    if (!canUpdateStatus(item.status, newStatus)) {
      throw new Error('INVALID_STATUS_TRANSITION');
    }

    return {
      ...item,
      status: newStatus,
      dataAtualizacao: new Date().toISOString(),
    };
  });

  if (!itemEncontrado) {
    throw new Error('ORCAMENTO_NOT_FOUND');
  }

  await saveAll(updatedOrcamentos);

  return updatedOrcamentos;
}
