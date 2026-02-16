import { useEffect, useState } from 'react';
import gazpImg from '../assets/stocks/gazp.png';
import goldImg from '../assets/stocks/gold.png';
import headImg from '../assets/stocks/hh.png';
import lukolImg from '../assets/stocks/lukol.png';
import mechelImg from '../assets/stocks/mechel.png';
import neftImg from '../assets/stocks/neft.png';
import nikelImg from '../assets/stocks/nikel.png';
import novatekImg from '../assets/stocks/novatek.png';
import rosneftImg from '../assets/stocks/rosneft.png';
import sberImg from '../assets/stocks/sber.png';
import tatNeftImg from '../assets/stocks/tatneft.png';
import tbankImg from '../assets/stocks/tbank.png';
import vtbImg from '../assets/stocks/vtb.png';
import x5Img from '../assets/stocks/x5.png';
import yandexImg from '../assets/stocks/yandex.png';

import { GistResponse, StockItem } from '../types';

export const TICKER_TO_IMAGE: Record<string, string> = {
  SBER: sberImg,
  T: tbankImg,
  PLZL: goldImg,
  YDEX: yandexImg,
  TRNFP: neftImg,
  LKOH: lukolImg,
  GAZP: gazpImg,
  GMKN: nikelImg,
  MTLR: mechelImg,
  NVTK: novatekImg,
  ROSN: rosneftImg,
  VTBR: vtbImg,
  X5: x5Img,
  HEAD: headImg,
  TATN: tatNeftImg,
};

export const useStocksData = () => {
  const [stocks, setStocks] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://gist.githubusercontent.com/nsdooris/a3b39707cdd7045ced1ef222543c3461/raw/');
      const data = (await response.json()) as GistResponse;
      setStocks(data.stocks.map(item => ({ ...item, img: TICKER_TO_IMAGE[item.ticker] })));

      setLoading(false);
    };

    fetchData();
  }, []);

  return { stocks, loading };
};
