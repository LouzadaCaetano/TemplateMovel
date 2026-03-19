import AsyncStorage from '@react-native-async-storage/async-storage';
import { Orcamento } from '@/types/ModeloOrcamento';
import { StatusOrcamento } from '@/types/StatusOrcamento';

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
