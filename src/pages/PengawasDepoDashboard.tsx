
import React, { useState } from 'react';
import Header from '../components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';

const PengawasDepoDashboard = () => {
  const [uploads, setUploads] = useState({
    fotoSegel: false,
    fotoSIB: false,
    fotoFTW: false,
    fotoP2H: false
  });

  const [waktuTiba, setWaktuTiba] = useState('');

  const handleFileUpload = (field: keyof typeof uploads) => {
    setUploads(prev => ({...prev, [field]: true}));
    toast.success('File berhasil diupload!');
  };

  const allUploadsComplete = Object.values(uploads).every(Boolean) && waktuTiba;

  const handleLanjutkanMSF = () => {
    toast.success('MSF berhasil dilanjutkan! Notifikasi dikirim ke GL PAMA.');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🧑‍🔧 Dashboard Pengawas Depo
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📋 Validasi Dokumen & Segel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label htmlFor="waktuTiba">Waktu Tiba Segel</Label>
                <Input
                  id="waktuTiba"
                  type="datetime-local"
                  value={waktuTiba}
                  onChange={(e) => setWaktuTiba(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-2 border-dashed border-gray-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      📷 Foto Kondisi Segel
                      {uploads.fotoSegel && <Badge className="bg-green-500">✓ Uploaded</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={() => handleFileUpload('fotoSegel')}
                    />
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      📄 Foto SIB (Surat Izin Bongkar)
                      {uploads.fotoSIB && <Badge className="bg-green-500">✓ Uploaded</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={() => handleFileUpload('fotoSIB')}
                    />
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      📊 Foto FTW (Fuel Transfer Worksheet)
                      {uploads.fotoFTW && <Badge className="bg-green-500">✓ Uploaded</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={() => handleFileUpload('fotoFTW')}
                    />
                  </CardContent>
                </Card>

                <Card className="border-2 border-dashed border-gray-300">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      🔧 Foto P2H (Pemeriksaan 2 Harian)
                      {uploads.fotoP2H && <Badge className="bg-green-500">✓ Uploaded</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={() => handleFileUpload('fotoP2H')}
                    />
                  </CardContent>
                </Card>
              </div>

              <div className="border-t pt-6">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h3 className="font-semibold mb-2">Status Validasi:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      {waktuTiba ? '✅' : '❌'} Waktu Tiba
                    </div>
                    <div className="flex items-center gap-2">
                      {uploads.fotoSegel ? '✅' : '❌'} Foto Segel
                    </div>
                    <div className="flex items-center gap-2">
                      {uploads.fotoSIB ? '✅' : '❌'} Foto SIB
                    </div>
                    <div className="flex items-center gap-2">
                      {uploads.fotoFTW ? '✅' : '❌'} Foto FTW
                    </div>
                    <div className="flex items-center gap-2">
                      {uploads.fotoP2H ? '✅' : '❌'} Foto P2H
                    </div>
                  </div>
                </div>

                <Button
                  className={`w-full ${
                    allUploadsComplete 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!allUploadsComplete}
                  onClick={handleLanjutkanMSF}
                >
                  {allUploadsComplete 
                    ? '✅ Lanjutkan MSF & Notifikasi GL PAMA' 
                    : '⚠️ Lengkapi Semua Dokumen untuk Lanjutkan MSF'
                  }
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PengawasDepoDashboard;
