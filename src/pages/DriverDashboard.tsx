
import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const DriverDashboard = () => {
  const [activeTab, setActiveTab] = useState('loading');
  const [location, setLocation] = useState('');

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
                        <Input id="tanggalMulai" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="waktuMulai">Waktu Mulai Loading</Label>
                        <Input id="waktuMulai" type="time" />
                      </div>
                      <div>
                        <Label htmlFor="tanggalSelesai">Tanggal Selesai Loading</Label>
                        <Input id="tanggalSelesai" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="waktuSelesai">Waktu Selesai Loading</Label>
                        <Input id="waktuSelesai" type="time" />
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
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
                        <Input id="tanggalKeluar" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="waktuKeluar">Waktu Keluar</Label>
                        <Input id="waktuKeluar" type="time" />
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
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
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
                        <Input id="waktuMulaiUnload" type="time" />
                      </div>
                      <div>
                        <Label htmlFor="waktuSelesaiUnload">Waktu Selesai Unloading</Label>
                        <Input id="waktuSelesaiUnload" type="time" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="fotoSegelUnload">Upload Foto Segel</Label>
                      <Input
                        id="fotoSegelUnload"
                        type="file"
                        accept="image/*"
                        capture="environment"
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
                    <Button className="w-full bg-orange-600 hover:bg-orange-700">
                      Submit FT Unloading
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Similar structure for other tabs */}
            {(activeTab === 'segel' || activeTab === 'dokumen') && (
              <Card>
                <CardHeader>
                  <CardTitle>
                    {activeTab === 'segel' ? '🔒 Segel Log' : '📄 Dokumen Pengangkutan'}
                  </CardTitle>
                  <p className="text-sm text-gray-600">Form ini diisi bersama dengan Pengawas Transportir</p>
                </CardHeader>
                <CardContent>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                    <p className="text-yellow-800">
                      ⚠️ Form ini akan diisi bersama dengan Pengawas Transportir.
                      Silakan koordinasi dengan Pengawas untuk melanjutkan proses ini.
                    </p>
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
