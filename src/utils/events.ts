import { LS, LSKeys } from '../ls';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (e: 'event', v: string, data?: Record<string, string>) => void;
  }
}

type Payload = {
  sum: number;
  autopayment_sum: number | null;
  autopayment_frec: string | null;
};

export const sendDataToGA = async (payload: Payload) => {
  try {
    const now = new Date();
    const date = `${now.getFullYear()}-${
      now.getMonth() + 1
    }-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    await fetch(
      'https://script.google.com/macros/s/AKfycbw0KjtvJ965mKFrz-Oizt54zipdedsSbgKFTTLm7VFfpSLos8xm1zxhKTuSJTSBy-hh/exec',
      {
        redirect: 'follow',
        method: 'POST',
        body: JSON.stringify({ datetime: date, ...payload, variant: '7132_5', user_id: LS.getItem(LSKeys.UserId, 0) }),
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
      },
    );
  } catch (error) {
    console.error('Error!', error);
  }
};
