import { useState } from "react";
import { FilterCard } from "@/components/FilterCard";
import { FilterChip } from "@/components/FilterChip";
import { RangeSlider } from "@/components/RangeSlider";
import { CreateFilterModal } from "@/components/CreateFilterModal";
import { ContractsTable } from "@/components/ContractsTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Plus, Zap } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import vivoLogo from "@/assets/vivo-logo.png";

const mockContracts = [
  { id: "1", number: "CT-2024-001", supplier: "TechCorp LTDA", type: "RE", value: 150000, paymentStatus: "Pago", dueDate: "15/03/2024" },
  { id: "2", number: "CT-2024-002", supplier: "InnovaSoft", type: "FI", value: 280000, paymentStatus: "Pendente", dueDate: "22/03/2024" },
  { id: "3", number: "CT-2024-003", supplier: "BuildCorp", type: "Engenharia", value: 750000, paymentStatus: "Vencido", dueDate: "10/03/2024" },
  { id: "4", number: "CT-2024-004", supplier: "DataSolutions", type: "Proposta", value: 420000, paymentStatus: "Pago", dueDate: "28/03/2024" },
  { id: "5", number: "CT-2024-005", supplier: "SystemsPlus", type: "RC", value: 95000, paymentStatus: "Pendente", dueDate: "05/04/2024" },
];

const Index = () => {
  // Filter states
  const [flowTypes, setFlowTypes] = useState<string[]>([]);
  const [contractValue, setContractValue] = useState<[number, number]>([0, 10000000]);
  const [paymentValue, setPaymentValue] = useState<[number, number]>([0, 10000000]);
  const [locationMode, setLocationMode] = useState<"region" | "state">("region");
  const [location, setLocation] = useState("");
  const [dateFilter, setDateFilter] = useState<string[]>([]);
  const [paymentStatus, setPaymentStatus] = useState("todos");
  const [supplierName, setSupplierName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [contractLimit, setContractLimit] = useState(10);
  const [customFilters, setCustomFilters] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [contractValueAll, setContractValueAll] = useState(false);
  const [paymentValueAll, setPaymentValueAll] = useState(false);

  const flowTypeOptions = ["RE", "Real State", "FI", "Proposta", "Engenharia", "RC", "Todos os contratos"];
  const dateOptions = ["Até 30 dias", "30 a 60 dias", "60 a 90 dias"];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (flowTypes.length > 0) count++;
    if (!contractValueAll && (contractValue[0] > 0 || contractValue[1] < 10000000)) count++;
    if (!paymentValueAll && (paymentValue[0] > 0 || paymentValue[1] < 10000000)) count++;
    if (location) count++;
    if (dateFilter.length > 0) count++;
    if (paymentStatus !== "todos") count++;
    if (supplierName) count++;
    if (cnpj) count++;
    if (costCenter) count++;
    count += customFilters.length;
    return count;
  };

  const handleFlowTypeToggle = (type: string) => {
    if (type === "Todos os contratos") {
      setFlowTypes(flowTypes.length === flowTypeOptions.length - 1 ? [] : flowTypeOptions.slice(0, -1));
    } else {
      setFlowTypes(prev => 
        prev.includes(type) 
          ? prev.filter(t => t !== type)
          : [...prev, type]
      );
    }
  };

  const handleDateFilterToggle = (date: string) => {
    setDateFilter(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleCreateFilter = (filter: any) => {
    setCustomFilters(prev => [...prev, filter]);
  };

  const handleDeleteFilter = (filterId: string) => {
    setCustomFilters(prev => prev.filter(f => f.id !== filterId));
  };

  const handleClearFilters = () => {
    setFlowTypes([]);
    setContractValue([0, 10000000]);
    setPaymentValue([0, 10000000]);
    setLocation("");
    setDateFilter([]);
    setPaymentStatus("todos");
    setSupplierName("");
    setCnpj("");
    setCostCenter("");
    setCustomFilters([]);
    setContractValueAll(false);
    setPaymentValueAll(false);
    setDateRange({});
  };

  const handleApplyFilters = () => {
    const activeCount = getActiveFiltersCount();
    if (activeCount === 0) {
      const confirm = window.confirm("Nenhum filtro selecionado. Deseja exibir todos os dados?");
      if (!confirm) return;
    }
    // Apply filters logic would go here
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src={vivoLogo} alt="Vivo" className="h-10" />
            <div>
              <h1 className="text-xl font-bold text-primary">Verificação inteligente de pagamentos</h1>
              {getActiveFiltersCount() > 0 && (
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Zap className="h-3 w-3 mr-1" />
                  {getActiveFiltersCount()} filtros aplicados
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Filter Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Contrato & Pagamento */}
          <FilterCard title="Contrato & Pagamento">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Tipo de fluxo</Label>
                <div className="flex flex-wrap gap-2">
                  {flowTypeOptions.map((type) => (
                    <FilterChip
                      key={type}
                      label={type}
                      active={type === "Todos os contratos" 
                        ? flowTypes.length === flowTypeOptions.length - 1
                        : flowTypes.includes(type)
                      }
                      onClick={() => handleFlowTypeToggle(type)}
                    />
                  ))}
                </div>
              </div>
              
              <RangeSlider
                label="Valor do contrato"
                min={0}
                max={10000000}
                value={contractValue}
                onChange={setContractValue}
                step={10000}
                formatValue={(v) => `R$ ${(v / 1000000).toFixed(1)}M`}
                showAllOption
                onSelectAll={() => setContractValueAll(!contractValueAll)}
                isAllSelected={contractValueAll}
              />
              
              <RangeSlider
                label="Valor do pagamento"
                min={0}
                max={10000000}
                value={paymentValue}
                onChange={setPaymentValue}
                step={10000}
                formatValue={(v) => `R$ ${(v / 1000000).toFixed(1)}M`}
                showAllOption
                onSelectAll={() => setPaymentValueAll(!paymentValueAll)}
                isAllSelected={paymentValueAll}
              />
            </div>
          </FilterCard>

          {/* Localização */}
          <FilterCard title="Localização">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={locationMode === "state"}
                  onCheckedChange={(checked) => setLocationMode(checked ? "state" : "region")}
                />
                <Label className="text-sm">
                  {locationMode === "region" ? "Por região" : "Por estado"}
                </Label>
              </div>
              
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder={`Selecione ${locationMode === "region" ? "região" : "estado"}`} />
                </SelectTrigger>
                <SelectContent>
                  {locationMode === "region" ? (
                    <>
                      <SelectItem value="sudeste">Sudeste</SelectItem>
                      <SelectItem value="sul">Sul</SelectItem>
                      <SelectItem value="nordeste">Nordeste</SelectItem>
                      <SelectItem value="norte">Norte</SelectItem>
                      <SelectItem value="centro-oeste">Centro-Oeste</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="sp">São Paulo</SelectItem>
                      <SelectItem value="rj">Rio de Janeiro</SelectItem>
                      <SelectItem value="mg">Minas Gerais</SelectItem>
                      <SelectItem value="rs">Rio Grande do Sul</SelectItem>
                      <SelectItem value="pr">Paraná</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </FilterCard>

          {/* Datas */}
          <FilterCard title="Datas">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Período</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {dateOptions.map((option) => (
                    <FilterChip
                      key={option}
                      label={option}
                      active={dateFilter.includes(option)}
                      onClick={() => handleDateFilterToggle(option)}
                    />
                  ))}
                </div>
                
                <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd/MM/yyyy", { locale: pt })} -{" "}
                            {format(dateRange.to, "dd/MM/yyyy", { locale: pt })}
                          </>
                        ) : (
                          format(dateRange.from, "dd/MM/yyyy", { locale: pt })
                        )
                      ) : (
                        "Selecionar intervalo personalizado"
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => setDateRange(range || {})}
                      numberOfMonths={2}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Status de vencimento</Label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vencidos">Vencidos</SelectItem>
                    <SelectItem value="nao-vencidos">Não vencidos</SelectItem>
                    <SelectItem value="todos">Todos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </FilterCard>

          {/* Fornecedor & Auditoria */}
          <FilterCard title="Fornecedor & Auditoria">
            <div className="space-y-4">
              <div>
                <Label htmlFor="supplier" className="text-sm font-medium">Nome fornecedor</Label>
                <Input
                  id="supplier"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  placeholder="Digite o nome do fornecedor"
                />
              </div>
              
              <div>
                <Label htmlFor="cnpj" className="text-sm font-medium">CNPJ</Label>
                <Input
                  id="cnpj"
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0000-00"
                />
              </div>
              
              <div>
                <Label htmlFor="cost-center" className="text-sm font-medium">Centro de custo</Label>
                <Input
                  id="cost-center"
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  placeholder="Digite o centro de custo"
                />
              </div>
            </div>
          </FilterCard>

          {/* Custom Filters */}
          {customFilters.map((filter) => (
            <FilterCard
              key={filter.id}
              title={filter.name}
              isDeletable
              onDelete={() => handleDeleteFilter(filter.id)}
            >
              {filter.type === "range" && (
                <RangeSlider
                  label="Valor"
                  min={0}
                  max={10000000}
                  value={[0, 10000000]}
                  onChange={() => {}}
                  formatValue={(v) => `R$ ${(v / 1000000).toFixed(1)}M`}
                />
              )}
              {filter.type === "dropdown" && (
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma opção" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opcao1">Opção 1</SelectItem>
                    <SelectItem value="opcao2">Opção 2</SelectItem>
                    <SelectItem value="opcao3">Opção 3</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {filter.type === "input" && (
                <Input placeholder="Digite um valor" />
              )}
              {filter.type === "multi-select" && (
                <div className="flex flex-wrap gap-2">
                  <FilterChip label="Opção 1" active={false} onClick={() => {}} />
                  <FilterChip label="Opção 2" active={false} onClick={() => {}} />
                  <FilterChip label="Opção 3" active={false} onClick={() => {}} />
                </div>
              )}
              {filter.type === "checkbox" && (
                <div className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <Label>Ativar filtro</Label>
                </div>
              )}
              {filter.type === "date" && (
                <Input type="date" />
              )}
            </FilterCard>
          ))}
        </div>

        {/* Quantidade de Contratos */}
        <div className="max-w-xs">
          <Label htmlFor="contract-limit" className="text-sm font-medium">Número de contratos a exibir</Label>
          <Input
            id="contract-limit"
            type="number"
            value={contractLimit}
            onChange={(e) => setContractLimit(parseInt(e.target.value) || 10)}
            min={1}
            max={1000}
            className="mt-2 w-32"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            <Button onClick={handleApplyFilters} className="bg-primary hover:bg-primary/90">
              Aplicar filtros
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            onClick={() => setIsModalOpen(true)}
            className="border-primary text-primary hover:bg-accent"
          >
            <Plus className="mr-2 h-4 w-4" />
            Adicionar novo filtro
          </Button>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">
            Contratos ({Math.min(contractLimit, mockContracts.length)} de {mockContracts.length})
          </h2>
          <ContractsTable contracts={mockContracts} limit={contractLimit} />
        </div>
      </div>

      {/* Create Filter Modal */}
      <CreateFilterModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreateFilter={handleCreateFilter}
      />
    </div>
  );
};

export default Index;