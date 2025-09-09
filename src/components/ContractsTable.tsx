import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Contract {
  id: string;
  number: string;
  supplier: string;
  type: string;
  value: number;
  paymentStatus: string;
  dueDate: string;
}

interface ContractsTableProps {
  contracts: Contract[];
  limit: number;
}

export const ContractsTable = ({ contracts, limit }: ContractsTableProps) => {
  const displayedContracts = contracts.slice(0, limit);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pago': return 'text-green-600';
      case 'pendente': return 'text-yellow-600';
      case 'vencido': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  if (displayedContracts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">
          Nenhum contrato encontrado com os filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número do Contrato</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead className="text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedContracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.number}</TableCell>
                <TableCell>{contract.supplier}</TableCell>
                <TableCell>{contract.type}</TableCell>
                <TableCell>{formatCurrency(contract.value)}</TableCell>
                <TableCell className={getStatusColor(contract.paymentStatus)}>
                  {contract.paymentStatus}
                </TableCell>
                <TableCell>{contract.dueDate}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {displayedContracts.map((contract) => (
          <Card key={contract.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-sm">{contract.number}</p>
                  <p className="text-sm text-muted-foreground">{contract.supplier}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="ml-1">{contract.type}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Valor:</span>
                  <span className="ml-1">{formatCurrency(contract.value)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <span className={`ml-1 ${getStatusColor(contract.paymentStatus)}`}>
                    {contract.paymentStatus}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Vencimento:</span>
                  <span className="ml-1">{contract.dueDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};