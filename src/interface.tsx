export interface userEGAT { 
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone_number: string;
    password: string;
    gender?: null;
    address?: null;
    city?: null;
    state?: null;
    country: string;
    timezone: string;
    currency_code: string;
    currency_symbol: string;
    is_active: number;
    profile_pic?: null;
    token: string;
    token_expiry: string;
    device_token: string;
    login_by: string;
    login_method: string;
    social_unique_id?: null;
    if_dispatch: number;
    if_corporate_user: number;
    corporate_admin_reference?: null;
    corporate_admin_id?: null;
    is_ios_production: number;
    otp_verification_code?: null;
    otp_verification_validation_time?: null;
    cancellation_continuous_skip: number;
    cancellation_continuous_skip_notified: number;
    continuous_cancellation_block: number;
    pickup_address?: null;
    in_trip: string;
    pick_lat?: null;
    pick_lng?: null;
    created_at: string;
    updated_at: string;
    deleted_at?: null;
    currency_id: number;
    stripe_id: string;
    payment_type: string;
    type: string;
  }
  
  export interface formData {
    firstName?: string;
    lastName?: string;
    email?: string;
    tel?: string;
    datetime?: any;
    dlatitude?: string;
    dlongtitude?: string;
    dlocation?: string;
    eta_distance?: string;
    eta_distance_price?: string;
    eta_time?: string;
    eta_time_price?: string;
    id?: string;
    is_share: 0;
    no_of_seats: 1;
    paymentOpt: 1;
    platitude?: string;
    plongtitude?: string;
    plocation?: string;
    timezone: "+07:00";
    type: 20;
    token? : string;
    minAmount? : number,
    remark? : string,
    orgReqID? : string
  }