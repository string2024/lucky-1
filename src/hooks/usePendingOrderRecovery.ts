import { useEffect } from 'react';
import { getPendingOrders, completeGrant, IAP_SKUS } from '@/lib/iap';
import { saveGrantedSku, saveBonusTokens } from '@/lib/iapStorage';
import { supabase } from '@/integrations/supabase/client';
import { isIapSupported } from '@/lib/iap';

export const usePendingOrderRecovery = () => {
  useEffect(() => {
    if (!isIapSupported()) return;

    const recover = async () => {
      const orders = await getPendingOrders();
      for (const order of orders) {
        const { data } = await supabase
          .from('purchases')
          .select('id')
          .eq('order_id', order.orderId)
          .single();

        if (!data) {
          await supabase.from('purchases').insert({
            order_id: order.orderId,
            sku: order.sku ?? IAP_SKUS.PREMIUM_PASS,
            product_type: order.sku === IAP_SKUS.BONUS_5PACK ? 'consumable' : 'non_consumable',
            amount: order.sku === IAP_SKUS.BONUS_5PACK ? 990 : 3300,
            status: 'DONE',
          });
        }

        if (order.sku === IAP_SKUS.PREMIUM_PASS) await saveGrantedSku(order.sku);
        else if (order.sku === IAP_SKUS.BONUS_5PACK) await saveBonusTokens(5);

        await completeGrant(order.orderId);
      }
    };

    recover().catch(console.error);
  }, []);
};
