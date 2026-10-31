import { useEffect } from 'react';
import { getPendingOrders, completeGrant, IAP_SKUS, isIapSupported } from '@/lib/iap';
import { saveGrantedSku, saveBonusTokens } from '@/lib/iapStorage';

// 결제 완료 전 앱이 종료돼 지급되지 않은 주문을 다시 지급한다. 지급은 폰 안 저장소에만 한다.
export const usePendingOrderRecovery = () => {
  useEffect(() => {
    if (!isIapSupported()) return;

    const recover = async () => {
      const orders = await getPendingOrders();
      for (const order of orders) {
        if (order.sku === IAP_SKUS.PREMIUM_PASS) await saveGrantedSku(order.sku);
        else if (order.sku === IAP_SKUS.BONUS_5PACK) await saveBonusTokens(5);

        await completeGrant(order.orderId);
      }
    };

    recover().catch(console.error);
  }, []);
};
