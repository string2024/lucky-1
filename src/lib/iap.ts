import { IAP } from '@apps-in-toss/web-framework';
import { supabase } from '@/integrations/supabase/client';
import { saveGrantedSku, saveBonusTokens } from './iapStorage';

export const IAP_SKUS = {
  PREMIUM_PASS: 'lucky1.premium.pass',
  BONUS_5PACK:  'lucky1.bonus.5pack',
} as const;

export type IapSku = typeof IAP_SKUS[keyof typeof IAP_SKUS];

export const isIapSupported = (): boolean => {
  try {
    return IAP.createOneTimePurchaseOrder.isSupported?.() ?? false;
  } catch {
    return false;
  }
};

export const getIapProducts = async () => {
  const res = await IAP.getProductItemList();
  return res?.products ?? [];
};

export const getPendingOrders = async () => {
  const res = await IAP.getPendingOrders();
  return res?.orders ?? [];
};

export const completeGrant = async (orderId: string) => {
  await IAP.completeProductGrant({ params: { orderId } });
};

// 상품 지급 핵심 로직 — 로컬 저장 우선, Supabase는 best-effort
const grantProduct = async (sku: IapSku, orderId: string): Promise<boolean> => {
  try {
    // 로컬 저장 먼저 (실패하면 false 반환 → SDK가 재시도)
    if (sku === IAP_SKUS.PREMIUM_PASS) {
      await saveGrantedSku(sku);
    } else if (sku === IAP_SKUS.BONUS_5PACK) {
      await saveBonusTokens(5);
    }

    // Supabase 기록은 실패해도 지급 유지 (fire and forget)
    supabase.from('purchases').insert({
      order_id: orderId,
      sku,
      product_type: sku === IAP_SKUS.PREMIUM_PASS ? 'non_consumable' : 'consumable',
      amount: sku === IAP_SKUS.PREMIUM_PASS ? 3300 : 990,
      status: 'DONE',
    }).then(({ error }) => {
      if (error) console.warn('[IAP] Supabase insert failed:', error);
    });

    return true;
  } catch {
    return false;
  }
};

// 앱 시작 시 미완료(pending) 주문 복구
export const recoverPendingOrders = async (): Promise<void> => {
  try {
    const orders = await getPendingOrders();
    for (const order of orders) {
      const sku = order.sku as IapSku;
      if (!Object.values(IAP_SKUS).includes(sku)) continue;
      const granted = await grantProduct(sku, order.orderId);
      if (granted) {
        await completeGrant(order.orderId);
      }
    }
  } catch {
    // 복구 실패 무시 (다음 시작 때 재시도)
  }
};

// cleanup 함수 반환 — 컴포넌트 언마운트 시 반드시 호출해야 브릿지 리소스 해제됨
export const requestPurchase = (params: {
  sku: IapSku;
  onSuccess: (orderId: string) => void;
  onError: (err: unknown) => void;
}): (() => void) => {
  return IAP.createOneTimePurchaseOrder({
    options: {
      sku: params.sku,
      processProductGrant: ({ orderId }) => grantProduct(params.sku, orderId),
    },
    onEvent: (event) => {
      if (event.type === 'success') params.onSuccess(event.data.orderId);
    },
    onError: async (err: unknown) => {
      // 비소모품 재구매 시도 → 로컬에 없으면 복구 후 성공 처리
      if (
        params.sku === IAP_SKUS.PREMIUM_PASS &&
        typeof err === 'object' && err !== null &&
        (err as { code?: string }).code === 'ITEM_ALREADY_OWNED'
      ) {
        await saveGrantedSku(params.sku);
        params.onSuccess('recovered');
        return;
      }
      params.onError(err);
    },
  });
};
