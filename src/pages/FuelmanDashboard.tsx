
import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from 'sonner';

const FuelmanDashboard = () => {
  const [activeTab, setActiveTab] = useState('mulai');
  const [location, setLocation] = useState('');
  const [unloadingData, setUnloadingData] = useState({
    waktuMulai: '',
    waktuSelesai: '',
    flowmeterA: '',
    flowmeterB: '',
    fmAwal: '',
    fmAkhir: '',
    fotoSegel: null as File | null
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUnloadingData({...unloadingData, fotoSegel: file});
      toast.success('Foto segel berhasil diupload!');
    }
  };

  const handleSubmitMulai = () => {
    if (!unloadingData.waktuMulai || !location || !unloadingData.flowmeterA || !unloadingData.fmAwal) {
      toast.error('Semua field harus diisi!');
      return;
    }
    toast.success('Data mulai unloading berhasil disimpan!');
  };

  const handleSubmitSelesai = () => {
    if (!unloadingData.waktuSelesai || !location || !unloadingData.flowmeterB || !unloadingData.fmAkhir) {
      toast.error('Semua field harus diisi!');
      return;
    }
    toast.success('Proses unloading selesai! Data berhasil disimpan.');
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
                        value={unloadingData.waktuMulai}
                        onChange={(e) => setUnloadingData({...unloadingData, waktuMulai: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fotoSegelMulai">Upload Foto Segel</Label>
                      <Input
                        id="fotoSegelMulai"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
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
                      <Select value={unloadingData.flowmeterA} onValueChange={(value) => setUnloadingData({...unloadingData, flowmeterA: value})}>
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
                        value={unloadingData.fmAwal}
                        onChange={(e) => setUnloadingData({...unloadingData, fmAwal: e.target.value})}
                        placeholder="Masukkan nilai FM awal"
                      />
                    </div>

                    <Button 
                      onClick={handleSubmitMulai}
                      className="w-full bg-blue-600 hover:bg-blue-700"
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
                        value={unloadingData.waktuSelesai}
                        onChange={(e) => setUnloadingData({...unloadingData, waktuSelesai: e.target.value})}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="fotoSegelSelesai">Upload Foto Segel</Label>
                      <Input
                        id="fotoSegelSelesai"
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileUpload}
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
                      <Select value={unloadingData.flowmeterB} onValueChange={(value) => setUnloadingData({...unloadingData, flowmeterB: value})}>
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
                        value={unloadingData.fmAkhir}
                        onChange={(e) => setUnloadingData({...unloadingData, fmAkhir: e.target.value})}
                        placeholder="Masukkan nilai FM akhir"
                      />
                    </div>

                    <Button 
                      onClick={handleSubmitSelesai}
                      className="w-full bg-green-600 hover:bg-green-700"
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
