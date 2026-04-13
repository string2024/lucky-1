import { IAP } from '@apps-in-toss/web-framework';
import { supabase } from '@/integrations/supabase/client';
import { saveGrantedSku, saveBonusTokens } from './iapStorage';

export const IAP_SKUS = {
  PREMIUM_PASS: 'lucky1.premium.pass',
  BONUS_5PACK:  'lucky1.bonus.5pack',
} as const;

export type IapSku = typeof IAP_SKUS[keyof typeof IAP_SKUS];

export const isIapSupported = (): boolean => {
  return IAP.createOneTimePurchaseOrder.isSupported?.() ?? false;
};

export const getIapProducts = async () => {
  const res = await IAP.getProductItemList();
  return res?.products ?? [];
};

export const requestPurchase = (params: {
  sku: IapSku;
  onSuccess: (orderId: string) => void;
  onError: (err: unknown) => void;
}) => {
  return IAP.createOneTimePurchaseOrder({
    options: {
      sku: params.sku,
      processProductGrant: async ({ orderId }: { orderId: string }) => {
        try {
          const { error } = await supabase.from('purchases').insert({
            order_id: orderId,
            sku: params.sku,
            product_type: params.sku === IAP_SKUS.PREMIUM_PASS ? 'non_consumable' : 'consumable',
            amount: params.sku === IAP_SKUS.PREMIUM_PASS ? 3300 : 990,
            status: 'DONE',
          });
          if (error) throw error;

          if (params.sku === IAP_SKUS.PREMIUM_PASS) {
            await saveGrantedSku(params.sku);
          } else if (params.sku === IAP_SKUS.BONUS_5PACK) {
            await saveBonusTokens(5);
          }
          return true;
        } catch {
          return false;
        }
      },
    },
    onEvent: (event: { type: string; data: { orderId: string } }) => {
      if (event.type === 'success') params.onSuccess(event.data.orderId);
    },
    onError: params.onError,
  });
};

export const getPendingOrders = async () => {
  const res = await IAP.getPendingOrders();
  return res?.orders ?? [];
};

export const completeGrant = async (orderId: string) => {
  await IAP.completeProductGrant({ params: { orderId } });
};
