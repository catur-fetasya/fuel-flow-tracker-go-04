export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      dokumen_logs: {
        Row: {
          created_at: string
          created_by: string
          foto_do_url: string | null
          foto_sampel_url: string | null
          foto_surat_jalan_url: string | null
          id: string
          lokasi: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          foto_do_url?: string | null
          foto_sampel_url?: string | null
          foto_surat_jalan_url?: string | null
          id?: string
          lokasi: string
          unit_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          foto_do_url?: string | null
          foto_sampel_url?: string | null
          foto_surat_jalan_url?: string | null
          id?: string
          lokasi?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dokumen_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dokumen_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      ft_unloading_logs: {
        Row: {
          created_at: string
          created_by: string
          foto_segel_url: string | null
          id: string
          lokasi: string
          unit_id: string
          waktu_mulai: string
          waktu_selesai: string
        }
        Insert: {
          created_at?: string
          created_by: string
          foto_segel_url?: string | null
          id?: string
          lokasi: string
          unit_id: string
          waktu_mulai: string
          waktu_selesai: string
        }
        Update: {
          created_at?: string
          created_by?: string
          foto_segel_url?: string | null
          id?: string
          lokasi?: string
          unit_id?: string
          waktu_mulai?: string
          waktu_selesai?: string
        }
        Relationships: [
          {
            foreignKeyName: "ft_unloading_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ft_unloading_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      fuelman_logs: {
        Row: {
          created_at: string
          created_by: string
          flowmeter_a: string | null
          flowmeter_b: string | null
          fm_akhir: number | null
          fm_awal: number | null
          foto_segel_url: string | null
          id: string
          lokasi: string
          status: string
          unit_id: string
          waktu_mulai: string | null
          waktu_selesai: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          flowmeter_a?: string | null
          flowmeter_b?: string | null
          fm_akhir?: number | null
          fm_awal?: number | null
          foto_segel_url?: string | null
          id?: string
          lokasi: string
          status: string
          unit_id: string
          waktu_mulai?: string | null
          waktu_selesai?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          flowmeter_a?: string | null
          flowmeter_b?: string | null
          fm_akhir?: number | null
          fm_awal?: number | null
          foto_segel_url?: string | null
          id?: string
          lokasi?: string
          status?: string
          unit_id?: string
          waktu_mulai?: string | null
          waktu_selesai?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fuelman_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fuelman_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      keluar_pertamina_logs: {
        Row: {
          created_at: string
          created_by: string
          id: string
          lokasi: string
          tanggal_keluar: string
          unit_id: string
          waktu_keluar: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          lokasi: string
          tanggal_keluar: string
          unit_id: string
          waktu_keluar: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          lokasi?: string
          tanggal_keluar?: string
          unit_id?: string
          waktu_keluar?: string
        }
        Relationships: [
          {
            foreignKeyName: "keluar_pertamina_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "keluar_pertamina_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      loading_logs: {
        Row: {
          created_at: string
          created_by: string
          id: string
          lokasi: string
          tanggal_mulai: string
          tanggal_selesai: string | null
          unit_id: string
          updated_at: string
          waktu_mulai: string
          waktu_selesai: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          lokasi: string
          tanggal_mulai: string
          tanggal_selesai?: string | null
          unit_id: string
          updated_at?: string
          waktu_mulai: string
          waktu_selesai?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          lokasi?: string
          tanggal_mulai?: string
          tanggal_selesai?: string | null
          unit_id?: string
          updated_at?: string
          waktu_mulai?: string
          waktu_selesai?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loading_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loading_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      pengawas_depo_logs: {
        Row: {
          created_at: string
          created_by: string
          foto_ftw_url: string | null
          foto_p2h_url: string | null
          foto_segel_url: string | null
          foto_sib_url: string | null
          id: string
          msf_completed: boolean | null
          unit_id: string
          waktu_tiba: string
        }
        Insert: {
          created_at?: string
          created_by: string
          foto_ftw_url?: string | null
          foto_p2h_url?: string | null
          foto_segel_url?: string | null
          foto_sib_url?: string | null
          id?: string
          msf_completed?: boolean | null
          unit_id: string
          waktu_tiba: string
        }
        Update: {
          created_at?: string
          created_by?: string
          foto_ftw_url?: string | null
          foto_p2h_url?: string | null
          foto_segel_url?: string | null
          foto_sib_url?: string | null
          id?: string
          msf_completed?: boolean | null
          unit_id?: string
          waktu_tiba?: string
        }
        Relationships: [
          {
            foreignKeyName: "pengawas_depo_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pengawas_depo_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      segel_logs: {
        Row: {
          created_at: string
          created_by: string
          foto_segel_url: string | null
          id: string
          lokasi: string
          nomor_segel_1: string
          nomor_segel_2: string
          unit_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          foto_segel_url?: string | null
          id?: string
          lokasi: string
          nomor_segel_1: string
          nomor_segel_2: string
          unit_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          foto_segel_url?: string | null
          id?: string
          lokasi?: string
          nomor_segel_1?: string
          nomor_segel_2?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "segel_logs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "segel_logs_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      units: {
        Row: {
          created_at: string
          driver_id: string | null
          driver_name: string
          id: string
          nomor_unit: string
          pengawas_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          driver_id?: string | null
          driver_name: string
          id?: string
          nomor_unit: string
          pengawas_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          driver_id?: string | null
          driver_name?: string
          id?: string
          nomor_unit?: string
          pengawas_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "units_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "units_pengawas_id_fkey"
            columns: ["pengawas_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_demo_user: {
        Args: {
          p_email: string
          p_name: string
          p_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: undefined
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
    }
    Enums: {
      user_role:
        | "admin"
        | "pengawas_transportir"
        | "driver"
        | "pengawas_depo"
        | "gl_pama"
        | "fuelman"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "admin",
        "pengawas_transportir",
        "driver",
        "pengawas_depo",
        "gl_pama",
        "fuelman",
      ],
    },
  },
} as const
