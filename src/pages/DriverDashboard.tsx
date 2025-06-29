import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { useLogs } from '../hooks/useLogs';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('loading');
  const [location, setLocation] = useState('');
  const [currentUnitId, setCurrentUnitId] = useState('unit-001'); // Mock unit ID for demo
  const { createLoadingLog, createKeluarPertaminaLog, createSegelLog, createDokumenLog } = useLogs();

  const [loadingFormData, setLoadingFormData] = useState({
    tanggalMulai: '',
    waktuMulai: '',
    tanggalSelesai: '',
    waktuSelesai: ''
  });

  const [keluarFormData, setKeluarFormData] = useState({
    tanggalKeluar: '',
    waktuKeluar: ''
  });

  const [unloadingFormData, setUnloadingFormData] = useState({
    waktuMulaiUnload: '',
    waktuSelesaiUnload: '',
    fotoSegel: null as File | null
  });

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = `${position.coords.latitude}, ${position.coords.longitude}`;
          setLocation(loc);
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

  const handleSimpanLoadingLog = async () => {
    if (!loadingFormData.tanggalMulai || !loadingFormData.waktuMulai || !location) {
      toast.error('Tanggal mulai, waktu mulai, dan lokasi harus diisi!');
      return;
    }

    const result = await createLoadingLog({
      unit_id: currentUnitId,
      tanggal_mulai: loadingFormData.tanggalMulai,
      waktu_mulai: loadingFormData.waktuMulai,
      tanggal_selesai: loadingFormData.tanggalSelesai || undefined,
      waktu_selesai: loadingFormData.waktuSelesai || undefined,
      lokasi: location
    });

    if (result) {
      toast.success('Loading log berhasil disimpan!');
      setLoadingFormData({ tanggalMulai: '', waktuMulai: '', tanggalSelesai: '', waktuSelesai: '' });
      setLocation('');
    } else {
      toast.error('Gagal menyimpan loading log!');
    }
  };

  const handleSimpanWaktuKeluar = async () => {
    if (!keluarFormData.tanggalKeluar || !keluarFormData.waktuKeluar || !location) {
      toast.error('Tanggal, waktu, dan lokasi harus diisi!');
      return;
    }

    const result = await createKeluarPertaminaLog({
      unit_id: currentUnitId,
      tanggal_keluar: keluarFormData.tanggalKeluar,
      waktu_keluar: keluarFormData.waktuKeluar,
      lokasi: location
    });

    if (result) {
      toast.success('Waktu keluar berhasil disimpan!');
      setKeluarFormData({ tanggalKeluar: '', waktuKeluar: '' });
      setLocation('');
    } else {
      toast.error('Gagal menyimpan waktu keluar!');
    }
  };

  const handleSubmitFTUnloading = async () => {
    if (!unloadingFormData.waktuMulaiUnload || !unloadingFormData.waktuSelesaiUnload || !location) {
      toast.error('Waktu mulai, waktu selesai, dan lokasi harus diisi!');
      return;
    }

    const result = await createDokumenLog({
      unit_id: currentUnitId,
      lokasi: location,
      foto_sampel_url: unloadingFormData.fotoSegel ? 'uploaded' : undefined
    });

    if (result) {
      toast.success('FT Unloading berhasil disubmit!');
      setUnloadingFormData({ waktuMulaiUnload: '', waktuSelesaiUnload: '', fotoSegel: null });
      setLocation('');
    } else {
      toast.error('Gagal submit FT Unloading!');
    }
  };

  const handleSimpanSegelLog = async () => {
    if (!location) {
      toast.error('Lokasi harus diisi!');
      return;
    }

    const result = await createSegelLog({
      unit_id: currentUnitId,
      lokasi: location
    });

    if (result) {
      toast.success('Segel log berhasil disimpan!');
      setLocation('');
    } else {
      toast.error('Gagal menyimpan segel log!');
    }
  };

  const handleSimpanDokumen = async () => {
    if (!location) {
      toast.error('Lokasi harus diisi!');
      return;
    }

    const result = await createDokumenLog({
      unit_id: currentUnitId,
      lokasi: location
    });

    if (result) {
      toast.success('Dokumen berhasil disimpan!');
      setLocation('');
    } else {
      toast.error('Gagal menyimpan dokumen!');
    }
  };

  const tabs = [
    { id: 'loading', label: 'Loading Log', icon: '⏰' },
    { id: 'segel', label: 'Segel Log', icon: '🔒' },
    { id: 'dokumen', label: 'Dokumen', icon: '📄' },
    { id: 'keluar', label: 'Keluar Pertamina', icon: '🚪' },
    { id: 'unloading', label: 'FT Unloading', icon: '🛻' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚚 Dashboard Driver Transportir
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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

            {activeTab === 'loading' && (
              <Card>
                <CardHeader>
                  <CardTitle>⏰ Loading Log</CardTitle>
                  <p className="text-sm text-gray-600">Catat waktu loading bersama Pengawas Transportir</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tanggalMulai">Tanggal Mulai Loading</Label>
                        <Input 
                          id="tanggalMulai" 
                          type="date" 
                          value={loadingFormData.tanggalMulai}
                          onChange={(e) => setLoadingFormData({...loadingFormData, tanggalMulai: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="waktuMulai">Waktu Mulai Loading</Label>
                        <Input 
                          id="waktuMulai" 
                          type="time" 
                          value={loadingFormData.waktuMulai}
                          onChange={(e) => setLoadingFormData({...loadingFormData, waktuMulai: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="tanggalSelesai">Tanggal Selesai Loading</Label>
                        <Input 
                          id="tanggalSelesai" 
                          type="date" 
                          value={loadingFormData.tanggalSelesai}
                          onChange={(e) => setLoadingFormData({...loadingFormData, tanggalSelesai: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="waktuSelesai">Waktu Selesai Loading</Label>
                        <Input 
                          id="waktuSelesai" 
                          type="time" 
                          value={loadingFormData.waktuSelesai}
                          onChange={(e) => setLoadingFormData({...loadingFormData, waktuSelesai: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lokasi">Lokasi</Label>
                      <div className="flex gap-2">
                        <Input
                          id="lokasi"
                          value={location}
                          placeholder="Koordinat lokasi akan muncul di sini"
                          readOnly
                        />
                        <Button 
                          type="button" 
                          onClick={handleGetLocation}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          📍 Get Location
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSimpanLoadingLog}>
                      Simpan Loading Log
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'keluar' && (
              <Card>
                <CardHeader>
                  <CardTitle>🚪 Waktu Keluar Pertamina</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tanggalKeluar">Tanggal Keluar</Label>
                        <Input 
                          id="tanggalKeluar" 
                          type="date" 
                          value={keluarFormData.tanggalKeluar}
                          onChange={(e) => setKeluarFormData({...keluarFormData, tanggalKeluar: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="waktuKeluar">Waktu Keluar</Label>
                        <Input 
                          id="waktuKeluar" 
                          type="time" 
                          value={keluarFormData.waktuKeluar}
                          onChange={(e) => setKeluarFormData({...keluarFormData, waktuKeluar: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="lokasiKeluar">Lokasi</Label>
                      <div className="flex gap-2">
                        <Input
                          id="lokasiKeluar"
                          value={location}
                          placeholder="Koordinat lokasi akan muncul di sini"
                          readOnly
                        />
                        <Button 
                          type="button" 
                          onClick={handleGetLocation}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          📍 Get Location
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSimpanWaktuKeluar}>
                      Simpan Waktu Keluar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'unloading' && (
              <Card>
                <CardHeader>
                  <CardTitle>🛻 FT Unloading (di lokasi tujuan)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="waktuMulaiUnload">Waktu Mulai Unloading</Label>
                        <Input 
                          id="waktuMulaiUnload" 
                          type="time" 
                          value={unloadingFormData.waktuMulaiUnload}
                          onChange={(e) => setUnloadingFormData({...unloadingFormData, waktuMulaiUnload: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label htmlFor="waktuSelesaiUnload">Waktu Selesai Unloading</Label>
                        <Input 
                          id="waktuSelesaiUnload" 
                          type="time" 
                          value={unloadingFormData.waktuSelesaiUnload}
                          onChange={(e) => setUnloadingFormData({...unloadingFormData, waktuSelesaiUnload: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="fotoSegelUnload">Upload Foto Segel</Label>
                      <Input
                        id="fotoSegelUnload"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => setUnloadingFormData({...unloadingFormData, fotoSegel: e.target.files?.[0] || null})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lokasiUnload">Lokasi</Label>
                      <div className="flex gap-2">
                        <Input
                          id="lokasiUnload"
                          value={location}
                          placeholder="Koordinat lokasi akan muncul di sini"
                          readOnly
                        />
                        <Button 
                          type="button" 
                          onClick={handleGetLocation}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          📍 Get Location
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleSubmitFTUnloading}>
                      Submit FT Unloading
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'segel' && (
              <Card>
                <CardHeader>
                  <CardTitle>🔒 Segel Log</CardTitle>
                  <p className="text-sm text-gray-600">Form ini diisi bersama dengan Pengawas Transportir</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="lokasiSegel">Lokasi</Label>
                      <div className="flex gap-2">
                        <Input
                          id="lokasiSegel"
                          value={location}
                          placeholder="Koordinat lokasi akan muncul di sini"
                          readOnly
                        />
                        <Button 
                          type="button" 
                          onClick={handleGetLocation}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          📍 Get Location
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSimpanSegelLog}>
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
                  <p className="text-sm text-gray-600">Form ini diisi bersama dengan Pengawas Transportir</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="lokasiDokumen">Lokasi</Label>
                      <div className="flex gap-2">
                        <Input
                          id="lokasiDokumen"
                          value={location}
                          placeholder="Koordinat lokasi akan muncul di sini"
                          readOnly
                        />
                        <Button 
                          type="button" 
                          onClick={handleGetLocation}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          📍 Get Location
                        </Button>
                      </div>
                    </div>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleSimpanDokumen}>
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

export default DriverDashboard;
