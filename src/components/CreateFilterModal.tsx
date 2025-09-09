import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface CreateFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateFilter: (filter: any) => void;
}

export const CreateFilterModal = ({ open, onOpenChange, onCreateFilter }: CreateFilterModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    table: "",
    field: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onCreateFilter({
      id: Date.now().toString(),
      ...formData,
    });
    
    setFormData({ name: "", type: "", table: "", field: "" });
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Criar Novo Filtro</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Tipo *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="range">Range</SelectItem>
                <SelectItem value="slider">Slider</SelectItem>
                <SelectItem value="dropdown">Dropdown</SelectItem>
                <SelectItem value="multi-select">Multi-select</SelectItem>
                <SelectItem value="input">Input</SelectItem>
                <SelectItem value="checkbox">Checkbox</SelectItem>
                <SelectItem value="date">Data</SelectItem>
                <SelectItem value="interval">Intervalo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="table">Tabela de origem *</Label>
            <Select value={formData.table} onValueChange={(value) => setFormData(prev => ({ ...prev, table: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a tabela" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contratos">Contratos</SelectItem>
                <SelectItem value="fornecedores">Fornecedores</SelectItem>
                <SelectItem value="pagamentos">Pagamentos</SelectItem>
                <SelectItem value="auditoria">Auditoria</SelectItem>
                <SelectItem value="centros_custo">Centros de Custo</SelectItem>
                <SelectItem value="aprovacoes">Aprovações</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="field">Campo da tabela *</Label>
            <Select value={formData.field} onValueChange={(value) => setFormData(prev => ({ ...prev, field: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o campo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="valor">Valor</SelectItem>
                <SelectItem value="data_vencimento">Data de Vencimento</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="categoria">Categoria</SelectItem>
                <SelectItem value="prioridade">Prioridade</SelectItem>
                <SelectItem value="responsavel">Responsável</SelectItem>
                <SelectItem value="descricao">Descrição</SelectItem>
                <SelectItem value="observacoes">Observações</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar filtro
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};