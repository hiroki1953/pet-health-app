export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      devices: {
        Row: {
          created_at: string | null;
          device_name: string;
          device_serial: string;
          device_type: string | null;
          id: string;
          last_data_received_at: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          device_name: string;
          device_serial: string;
          device_type?: string | null;
          id?: string;
          last_data_received_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          device_name?: string;
          device_serial?: string;
          device_type?: string | null;
          id?: string;
          last_data_received_at?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "devices_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      pets: {
        Row: {
          birth_date: string | null;
          breed: string | null;
          created_at: string | null;
          gender: string | null;
          id: string;
          pet_name: string;
          photo_url: string | null;
          species: string;
          updated_at: string | null;
          user_id: string | null;
          weight: number | null;
        };
        Insert: {
          birth_date?: string | null;
          breed?: string | null;
          created_at?: string | null;
          gender?: string | null;
          id?: string;
          pet_name: string;
          photo_url?: string | null;
          species: string;
          updated_at?: string | null;
          user_id?: string | null;
          weight?: number | null;
        };
        Update: {
          birth_date?: string | null;
          breed?: string | null;
          created_at?: string | null;
          gender?: string | null;
          id?: string;
          pet_name?: string;
          photo_url?: string | null;
          species?: string;
          updated_at?: string | null;
          user_id?: string | null;
          weight?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "pets_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      test_results: {
        Row: {
          bilirubin_level: number | null;
          created_at: string | null;
          device_id: string | null;
          glucose_level: number | null;
          id: string;
          image_url: string | null;
          pet_id: string | null;
          ph_value: number | null;
          protein_level: number | null;
          specific_gravity: number | null;
          tested_at: string;
        };
        Insert: {
          bilirubin_level?: number | null;
          created_at?: string | null;
          device_id?: string | null;
          glucose_level?: number | null;
          id?: string;
          image_url?: string | null;
          pet_id?: string | null;
          ph_value?: number | null;
          protein_level?: number | null;
          specific_gravity?: number | null;
          tested_at: string;
        };
        Update: {
          bilirubin_level?: number | null;
          created_at?: string | null;
          device_id?: string | null;
          glucose_level?: number | null;
          id?: string;
          image_url?: string | null;
          pet_id?: string | null;
          ph_value?: number | null;
          protein_level?: number | null;
          specific_gravity?: number | null;
          tested_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "test_results_device_id_fkey";
            columns: ["device_id"];
            isOneToOne: false;
            referencedRelation: "devices";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "test_results_pet_id_fkey";
            columns: ["pet_id"];
            isOneToOne: false;
            referencedRelation: "pets";
            referencedColumns: ["id"];
          },
        ];
      };
      test_results_summary: {
        Row: {
          created_at: string | null;
          determined_at: string | null;
          id: string;
          notes: string | null;
          overall_status: string;
          test_result_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          determined_at?: string | null;
          id?: string;
          notes?: string | null;
          overall_status: string;
          test_result_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          determined_at?: string | null;
          id?: string;
          notes?: string | null;
          overall_status?: string;
          test_result_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "test_results_summary_test_result_id_fkey";
            columns: ["test_result_id"];
            isOneToOne: true;
            referencedRelation: "test_results";
            referencedColumns: ["id"];
          },
        ];
      };
      user_settings: {
        Row: {
          created_at: string | null;
          email_notifications_enabled: boolean | null;
          id: string;
          language: string | null;
          notification_time_end: string | null;
          notification_time_start: string | null;
          push_notifications_enabled: boolean | null;
          timezone: string | null;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          email_notifications_enabled?: boolean | null;
          id?: string;
          language?: string | null;
          notification_time_end?: string | null;
          notification_time_start?: string | null;
          push_notifications_enabled?: boolean | null;
          timezone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          email_notifications_enabled?: boolean | null;
          id?: string;
          language?: string | null;
          notification_time_end?: string | null;
          notification_time_start?: string | null;
          push_notifications_enabled?: boolean | null;
          timezone?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_settings_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          email: string;
          id: string;
          updated_at: string | null;
          user_name: string | null;
        };
        Insert: {
          created_at?: string | null;
          email: string;
          id?: string;
          updated_at?: string | null;
          user_name?: string | null;
        };
        Update: {
          created_at?: string | null;
          email?: string;
          id?: string;
          updated_at?: string | null;
          user_name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
