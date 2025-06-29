
import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';
import { useLogs } from '../hooks/useLogs';
import { useUnits } from '../hooks/useUnits';

const FuelmanDashboard = () => {
  const [activeTab, setActiveTab] = useState('mulai');
  const [location, setLocation] = useState('');
  const { units } = useUnits();
  const { createFuelmanLog } = useLogs();
  const [unloadingData, setUnloadingData] = useState({
    unit_id: '',
    waktu_mulai: '',
    waktu_selesai: '',
    flowmeter_a: '',
    flowmeter_b: '',
    fm_awal: '',
    fm_akhir: '',
    foto_segel_url: ''
  });

  const flowmeters = [
    { id: 'FM001', name: 'Flowmeter A - Serial: FM001-2024' },
    { id: 'FM002', name: 'Flowmeter B - Serial: FM002-2024' },
    { id: 'FM003', name: 'Flowmeter C - Serial: FM003-2024' }
  ];

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

  const handleSubmitMulai = async () => {
    if (!unloadingData.unit_id || !unloadingData.waktu_mulai || !location || !unloadingData.flowmeter_a || !unloadingData.fm_awal) {
      toast.error('Semua field harus diisi!');
      return;
    }

    const result = await createFuelmanLog({
      unit_id: unloadingData.unit_id,
      waktu_mulai: unloadingData.waktu_mulai,
      lokasi: location,
      flowmeter_a: unloadingData.flowmeter_a,
      fm_awal: parseFloat(unloadingData.fm_awal),
      status: 'mulai'
    });

    if (result) {
      toast.success('Data mulai unloading berhasil disimpan!');
      setUnloadingData(prev => ({ ...prev, waktu_mulai: '', flowmeter_a: '', fm_awal: '' }));
    } else {
      toast.error('Gagal menyimpan data!');
    }
  };

  const handleSubmitSelesai = async () => {
    if (!unloadingData.unit_id || !unloadingData.waktu_selesai || !location || !unloadingData.flowmeter_b || !unloadingData.fm_akhir) {
      toast.error('Semua field harus diisi!');
      return;
    }

    const result = await createFuelmanLog({
      unit_id: unloadingData.unit_id,
      waktu_selesai: unloadingData.waktu_selesai,
      lokasi: location,
      flowmeter_b: unloadingData.flowmeter_b,
      fm_akhir: parseFloat(unloadingData.fm_akhir),
      status: 'selesai'
    });

    if (result) {
      toast.success('Proses unloading selesai! Data berhasil disimpan.');
      setUnloadingData(prev => ({ ...prev, waktu_selesai: '', flowmeter_b: '', fm_akhir: '' }));
    } else {
      toast.error('Gagal menyimpan data!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              ⛽ Dashboard Fuelman
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <Label htmlFor="unit_select">Pilih Unit Transport</Label>
              <Select value={unloadingData.unit_id} onValueChange={(value) => setUnloadingData({...unloadingData, unit_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih unit transport" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((unit) => (
                    <SelectItem key={unit.id} value={unit.id}>
                      {unit.nomor_unit} - {unit.driver_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                variant={activeTab === 'mulai' ? "default" : "outline"}
                className={`p-6 h-auto flex flex-col items-center gap-2 ${
                  activeTab === 'mulai' ? 'bg-blue-600 text-white' : ''
                }`}
                onClick={() => setActiveTab('mulai')}
              >
                <span className="text-3xl">🚀</span>
                <span className="text-center">Mulai Unloading</span>
              </Button>
              <Button
                variant={activeTab === 'selesai' ? "default" : "outline"}
                className={`p-6 h-auto flex flex-col items-center gap-2 ${
                  activeTab === 'selesai' ? 'bg-green-600 text-white' : ''
                }`}
                onClick={() => setActiveTab('selesai')}
              >
                <span className="text-3xl">✅</span>
                <span className="text-center">Selesai Unloading</span>
              </Button>
            </div>

            {activeTab === 'mulai' && (
              <Card>
                <CardHeader>
                  <CardTitle>🚀 Mulai Unloading</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="waktuMulai">Waktu Mulai</Label>
                      <Input
                        id="waktuMulai"
                        type="time"
                        value={unloadingData.waktu_mulai}
                        onChange={(e) => setUnloadingData({...unloadingData, waktu_mulai: e.target.value})}
                      />
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

                    <div>
                      <Label htmlFor="flowmeterA">Pilih Alat Flowmeter</Label>
                      <Select value={unloadingData.flowmeter_a} onValueChange={(value) => setUnloadingData({...unloadingData, flowmeter_a: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih flowmeter" />
                        </SelectTrigger>
                        <SelectContent>
                          {flowmeters.map((fm) => (
                            <SelectItem key={fm.id} value={fm.id}>
                              {fm.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="fmAwal">FM Awal</Label>
                      <Input
                        id="fmAwal"
                        type="number"
                        value={unloadingData.fm_awal}
                        onChange={(e) => setUnloadingData({...unloadingData, fm_awal: e.target.value})}
                        placeholder="Masukkan nilai FM awal"
                      />
                    </div>

                    <Button 
                      onClick={handleSubmitMulai}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      disabled={!unloadingData.unit_id}
                    >
                      Simpan Data Mulai Unloading
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'selesai' && (
              <Card>
                <CardHeader>
                  <CardTitle>✅ Selesai Unloading</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="waktuSelesai">Waktu Selesai</Label>
                      <Input
                        id="waktuSelesai"
                        type="time"
                        value={unloadingData.waktu_selesai}
                        onChange={(e) => setUnloadingData({...unloadingData, waktu_selesai: e.target.value})}
                      />
                    </div>

                    <div>
                      <Label htmlFor="lokasiSelesai">Lokasi</Label>
                      <div className="flex gap-2">
                        <Input
                          id="lokasiSelesai"
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

                    <div>
                      <Label htmlFor="flowmeterB">Pilih Alat Flowmeter B</Label>
                      <Select value={unloadingData.flowmeter_b} onValueChange={(value) => setUnloadingData({...unloadingData, flowmeter_b: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih flowmeter B" />
                        </SelectTrigger>
                        <SelectContent>
                          {flowmeters.map((fm) => (
                            <SelectItem key={fm.id} value={fm.id}>
                              {fm.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="fmAkhir">FM Akhir</Label>
                      <Input
                        id="fmAkhir"
                        type="number"
                        value={unloadingData.fm_akhir}
                        onChange={(e) => setUnloadingData({...unloadingData, fm_akhir: e.target.value})}
                        placeholder="Masukkan nilai FM akhir"
                      />
                    </div>

                    <Button 
                      onClick={handleSubmitSelesai}
                      className="w-full bg-green-600 hover:bg-green-700"
                      disabled={!unloadingData.unit_id}
                    >
                      Submit Akhir Proses
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

export default FuelmanDashboard;
