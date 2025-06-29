
import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

interface TransportData {
  id: string;
  nomorUnit: string;
  driver: string;
  tujuan: string;
  status: string;
  tanggal: string;
  progress: number;
}

const GLPamaDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransport, setSelectedTransport] = useState<TransportData | null>(null);
  const [transportData] = useState<TransportData[]>([
    {
      id: '1',
      nomorUnit: 'TRK001',
      driver: 'Budi Santoso',
      tujuan: 'Depo Jakarta',
      status: 'MSF Completed',
      tanggal: '2024-06-29',
      progress: 100
    },
    {
      id: '2',
      nomorUnit: 'TRK002',
      driver: 'Ahmad Yani',
      tujuan: 'Depo Bandung',
      status: 'In Transit',
      tanggal: '2024-06-29',
      progress: 65
    },
    {
      id: '3',
      nomorUnit: 'TRK003',
      driver: 'Siti Nurhaliza',
      tujuan: 'Depo Surabaya',
      status: 'Loading',
      tanggal: '2024-06-29',
      progress: 25
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'MSF Completed':
        return 'bg-green-500';
      case 'In Transit':
        return 'bg-blue-500';
      case 'Loading':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleExportPDF = () => {
    // Generate CSV data for demonstration
    const csvData = transportData.map(item => ({
      'Nomor Unit': item.nomorUnit,
      'Driver': item.driver,
      'Tujuan': item.tujuan,
      'Status': item.status,
      'Progress': `${item.progress}%`,
      'Tanggal': item.tanggal
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0]).join(',');
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csvContent = `${headers}\n${rows}`;

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transport-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Laporan PDF berhasil didownload!');
  };

  const handleExportExcel = () => {
    // Generate Excel-compatible CSV
    const csvData = transportData.map(item => ({
      'Nomor Unit': item.nomorUnit,
      'Driver': item.driver,
      'Tujuan': item.tujuan,
      'Status': item.status,
      'Progress': `${item.progress}%`,
      'Tanggal': item.tanggal
    }));

    const headers = Object.keys(csvData[0]).join('\t');
    const rows = csvData.map(row => Object.values(row).join('\t')).join('\n');
    const excelContent = `${headers}\n${rows}`;

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transport-report-${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Laporan Excel berhasil didownload!');
  };

  const handleViewDetail = (transport: TransportData) => {
    setSelectedTransport(transport);
    toast.info(`Menampilkan detail untuk ${transport.nomorUnit}`);
  };

  const filteredData = transportData.filter(item =>
    item.nomorUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.driver.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tujuan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Header />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="bg-blue-500 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{transportData.length}</div>
              <div className="text-blue-100">Total Transport</div>
            </CardContent>
          </Card>
          <Card className="bg-green-500 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {transportData.filter(t => t.status === 'MSF Completed').length}
              </div>
              <div className="text-green-100">MSF Selesai</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-500 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {transportData.filter(t => t.status === 'In Transit').length}
              </div>
              <div className="text-yellow-100">Dalam Perjalanan</div>
            </CardContent>
          </Card>
          <Card className="bg-orange-500 text-white">
            <CardContent className="p-4">
              <div className="text-2xl font-bold">
                {transportData.filter(t => t.status === 'Loading').length}
              </div>
              <div className="text-orange-100">Loading</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              🧑‍💻 Dashboard GL PAMA - Monitoring Transport
              <div className="flex gap-2">
                <Button onClick={handleExportPDF} className="bg-red-600 hover:bg-red-700">
                  📄 Export PDF
                </Button>
                <Button onClick={handleExportExcel} className="bg-green-600 hover:bg-green-700">
                  📊 Export Excel
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Input
                placeholder="Cari berdasarkan nomor unit, driver, atau tujuan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Nomor Unit</th>
                    <th className="text-left p-3">Driver</th>
                    <th className="text-left p-3">Tujuan</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Progress</th>
                    <th className="text-left p-3">Tanggal</th>
                    <th className="text-left p-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{item.nomorUnit}</td>
                      <td className="p-3">{item.driver}</td>
                      <td className="p-3">{item.tujuan}</td>
                      <td className="p-3">
                        <Badge className={getStatusColor(item.status)}>
                          {item.status}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">{item.progress}%</span>
                      </td>
                      <td className="p-3">{item.tanggal}</td>
                      <td className="p-3">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetail(item)}>
                          Detail
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedTransport && (
              <Card className="mt-6 bg-blue-50">
                <CardHeader>
                  <CardTitle>Detail Transport: {selectedTransport.nomorUnit}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Driver:</strong> {selectedTransport.driver}
                    </div>
                    <div>
                      <strong>Tujuan:</strong> {selectedTransport.tujuan}
                    </div>
                    <div>
                      <strong>Status:</strong> {selectedTransport.status}
                    </div>
                    <div>
                      <strong>Progress:</strong> {selectedTransport.progress}%
                    </div>
                    <div>
                      <strong>Tanggal:</strong> {selectedTransport.tanggal}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="mt-4" 
                    onClick={() => setSelectedTransport(null)}
                  >
                    Tutup Detail
                  </Button>
                </CardContent>
              </Card>
            )}

            {transportData.filter(t => t.status === 'MSF Completed').length > 0 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">🔔 Notifikasi Terbaru</h3>
                <p className="text-green-700">
                  {transportData.filter(t => t.status === 'MSF Completed').length} transport telah menyelesaikan MSF 
                  dan siap untuk review final.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GLPamaDashboard;
