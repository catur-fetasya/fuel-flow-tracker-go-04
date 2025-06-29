import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { useUnits } from '../hooks/useUnits';
import { useLogs } from '../hooks/useLogs';

const PengawasTransportirDashboard = () => {
  const [activeTab, setActiveTab] = useState('input-unit');
  const [currentUnitId, setCurrentUnitId] = useState('unit-001'); // Mock unit ID for demo
  const { createUnit } = useUnits();
  const { createLoadingLog, createSegelLog, createDokumenLog } = useLogs();
  
  const [unitData, setUnitData] = useState({
    nomorUnit: '',
    namaDriver: ''
  });
  const [loadingData, setLoadingData] = useState({
    tanggalMulai: '',
    waktuMulai: '',
    tanggalSelesai: '',
    waktuSelesai: '',
    lokasi: ''
  });
  const [segelData, setSegelData] = useState({
    fotoSegel: null as File | null,
    nomorSegel1: '',
    nomorSegel2: '',
    lokasi: ''
  });

  const handleGetLocation = (target: 'loading' | 'segel' | 'dokumen') => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = `${position.coords.latitude}, ${position.coords.longitude}`;
          if (target === 'loading') {
            setLoadingData({...loadingData, lokasi: location});
          } else if (target === 'segel') {
            setSegelData({...segelData, lokasi: location});
          }
          toast.success('Lokasi berhasil diambil!');
        },
        (error) => {
          toast.error('Gagal mengambil lokasi!');
        }
      );
    } else {
      toast.error('Geolocation tidak didukung browser ini!');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSegelData({...segelData, fotoSegel: file});
      toast.success('Foto berhasil diupload!');
    }
  };

  const handleSubmitUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!unitData.nomorUnit || !unitData.namaDriver) {
      toast.error('Semua field harus diisi!');
      return;
    }

    const result = await createUnit({
      nomor_unit: unitData.nomorUnit,
      driver_name: unitData.namaDriver,
      pengawas_id: 'current-user-id' // This should come from auth context
    });

    if (result) {
      toast.success('Data unit berhasil disimpan!');
      setCurrentUnitId(result.id || 'unit-001');
      setUnitData({nomorUnit: '', namaDriver: ''});
    } else {
      toast.error('Gagal menyimpan data unit!');
    }
  };

  const handleSubmitLoading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loadingData.tanggalMulai || !loadingData.waktuMulai || !loadingData.lokasi) {
      toast.error('Tanggal mulai, waktu mulai, dan lokasi harus diisi!');
      return;
    }

    const result = await createLoadingLog({
      unit_id: currentUnitId,
      tanggal_mulai: loadingData.tanggalMulai,
      waktu_mulai: loadingData.waktuMulai,
      tanggal_selesai: loadingData.tanggalSelesai || undefined,
      waktu_selesai: loadingData.waktuSelesai || undefined,
      lokasi: loadingData.lokasi
    });

    if (result) {
      toast.success('Data loading berhasil disimpan!');
      setLoadingData({
        tanggalMulai: '',
        waktuMulai: '',
        tanggalSelesai: '',
        waktuSelesai: '',
        lokasi: ''
      });
    } else {
      toast.error('Gagal menyimpan loading log!');
    }
  };

  const handleSubmitSegel = async () => {
    if (!segelData.nomorSegel1 || !segelData.lokasi) {
      toast.error('Nomor segel dan lokasi harus diisi!');
      return;
    }

    const result = await createSegelLog({
      unit_id: currentUnitId,
      nomor_segel_1: segelData.nomorSegel1,
      nomor_segel_2: segelData.nomorSegel2,
      lokasi: segelData.lokasi,
      foto_segel_url: segelData.fotoSegel ? 'uploaded' : undefined
    });

    if (result) {
      toast.success('Segel log berhasil disimpan!');
      setSegelData({
        fotoSegel: null,
        nomorSegel1: '',
        nomorSegel2: '',
        lokasi: ''
      });
    } else {
      toast.error('Gagal menyimpan segel log!');
    }
  };

  const handleSubmitDokumen = async () => {
    const result = await createDokumenLog({
      unit_id: currentUnitId,
      lokasi: 'current-location' // This should be captured from location
    });

    if (result) {
      toast.success('Dokumen berhasil disimpan!');
    } else {
      toast.error('Gagal menyimpan dokumen!');
    }
  };

  const tabs = [
    { id: 'input-unit', label: 'Input Data Unit', icon: '🚚' },
    { id: 'loading-log', label: 'Loading Log', icon: '⏰' },
    { id: 'segel-log', label: 'Segel Log', icon: '🔒' },
    { id: 'dokumen', label: 'Dokumen', icon: '📄' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              👷‍♂️ Dashboard Pengawas Transportir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  className={`p-4 h-auto flex flex-col items-center gap-2 ${
                    activeTab === tab.id ? 'bg-blue-600 text-white' : ''
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <span className="text-xs text-center">{tab.label}</span>
                </Button>
              ))}
            </div>

            {activeTab === 'input-unit' && (
              <Card>
                <CardHeader>
                  <CardTitle>🚚 Input Data Unit</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitUnit} className="space-y-4">
                    <div>
                      <Label htmlFor="nomorUnit">Nomor Unit</Label>
                      <Input
                        id="nomorUnit"
                        value={unitData.nomorUnit}
                        onChange={(e) => setUnitData({...unitData, nomorUnit: e.target.value})}
                        placeholder="Masukkan nomor unit"
                      />
                    </div>
                    <div>
                      <Label htmlFor="namaDriver">Nama Driver</Label>
                      <Input
                        id="namaDriver"
                        value={unitData.namaDriver}
                        onChange={(e) => setUnitData({...unitData, namaDriver: e.target.value})}
                        placeholder="Masukkan nama driver"
                      />
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Simpan Data Unit
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'loading-log' && (
              <Card>
                <CardHeader>
                  <CardTitle>⏰ Loading Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitLoading} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tanggalMulai">Tanggal Mulai Loading</Label>
                        <Input
                          id="tanggalMulai"
                          type="date"
                          value={loadingData.tanggalMulai}
                          onChange={(e) => setLoadingData({...loadingData, tanggalMulai: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="waktuMulai">Waktu Mulai Loading</Label>
                        <Input
                          id="waktuMulai"
                          type="time"
                          value={loadingData.waktuMulai}
                          onChange={(e) => setLoadingData({...loadingData, waktuMulai: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tanggalSelesai">Tanggal Selesai Loading</Label>
                        <Input
                          id="tanggalSelesai"
                          type="date"
                          value={loadingData.tanggalSelesai}
                          onChange={(e) => setLoadingData({...loadingData, tanggalSelesai: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="waktuSelesai">Waktu Selesai Loading</Label>
                        <Input
                          id="waktuSelesai"
                          type="time"
                          value={loadingData.waktuSelesai}
                          onChange={(e) => setLoadingData({...loadingData, waktuSelesai: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lokasi">Lokasi</Label>
                      <div className="flex gap-2">
                        <Input
                          id="lokasi"
                          value={loadingData.lokasi}
                          onChange={(e) => setLoadingData({...loadingData, lokasi: e.target.value})}
                          placeholder="Koordinat lokasi akan muncul di sini"
                          readOnly
                        />
                        <Button 
                          type="button" 
                          onClick={() => handleGetLocation('loading')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          📍 Get Location
                        </Button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Simpan Loading Log
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {activeTab === 'segel-log' && (
              <Card>
                <CardHeader>
                  <CardTitle>🔒 Segel Log</CardTitle>
                  <p className="text-sm text-gray-600">Form ini diisi bersama dengan Driver</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fotoSegel">Upload Foto Segel</Label>
                      <Input
                        id="fotoSegel"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
                        className="mt-1"
                      />
                      {segelData.fotoSegel && (
                        <Badge variant="outline" className="mt-2 text-green-600">
                          ✓ Foto terupload: {segelData.fotoSegel.name}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nomorSegel1">Nomor Segel 1</Label>
                        <Input
                          id="nomorSegel1"
                          value={segelData.nomorSegel1}
                          onChange={(e) => setSegelData({...segelData, nomorSegel1: e.target.value})}
                          placeholder="Masukkan nomor segel 1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="nomorSegel2">Nomor Segel 2</Label>
                        <Input
                          id="nomorSegel2"
                          value={segelData.nomorSegel2}
                          onChange={(e) => setSegelData({...segelData, nomorSegel2: e.target.value})}
                          placeholder="Masukkan nomor segel 2"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lokasiSegel">Lokasi</Label>
                      <div className="flex gap-2">
                        <Input
                          id="lokasiSegel"
                          value={segelData.lokasi}
                          placeholder="Koordinat lokasi akan muncul di sini"
                          readOnly
                        />
                        <Button 
                          type="button" 
                          onClick={() => handleGetLocation('segel')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          📍 Get Location
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmitSegel}>
                      Simpan Segel Log
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'dokumen' && (
              <Card>
                <CardHeader>
                  <CardTitle>📄 Dokumen Pengangkutan</CardTitle>
                  <p className="text-sm text-gray-600">Form ini diisi bersama dengan Driver</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fotoSampel">Upload Foto Sampel BBM</Label>
                      <Input
                        id="fotoSampel"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fotoDO">Upload DO (Delivery Order)</Label>
                      <Input
                        id="fotoDO"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fotoSuratJalan">Upload Surat Jalan</Label>
                      <Input
                        id="fotoSuratJalan"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lokasiDokumen">Lokasi</Label>
                      <div className="flex gap-2">
                        <Input
                          id="lokasiDokumen"
                          placeholder="Koordinat lokasi akan muncul di sini"
                          readOnly
                        />
                        <Button 
                          type="button" 
                          onClick={() => handleGetLocation('dokumen')}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          📍 Get Location
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSubmitDokumen}>
                      Simpan Dokumen
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PengawasTransportirDashboard;
