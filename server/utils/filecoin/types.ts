export interface DealRequest {
  piece_cid: string;
  piece_size: number;
  verified_deal: boolean;
  label: string;
  start_epoch: number;
  end_epoch: number;
  storage_price_per_epoch: number;
  provider_collateral: number;
  client_collateral: number;
  extra_params_version: number;
  extra_params: ExtraParamsV1;
}

export interface ExtraParamsV1 {
  location_ref: string;
  car_size: number;
  skip_ipni_announce: boolean;
  remove_unsealed_copy: boolean;
}