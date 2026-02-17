import { AmountInput } from '@alfalab/core-components/amount-input/cssm';
import { Button } from '@alfalab/core-components/button/cssm';
import { CalendarMobile } from '@alfalab/core-components/calendar/cssm/mobile';
import { Collapse } from '@alfalab/core-components/collapse/cssm';

import { Gap } from '@alfalab/core-components/gap/cssm';
import { Input } from '@alfalab/core-components/input/cssm';
import { PureCell } from '@alfalab/core-components/pure-cell/cssm';
import { SelectMobile } from '@alfalab/core-components/select/cssm/mobile';
import { Steps } from '@alfalab/core-components/steps/cssm';
import { Switch } from '@alfalab/core-components/switch/cssm';
import { Typography } from '@alfalab/core-components/typography/cssm';
import { CalendarMIcon } from '@alfalab/icons-glyph/CalendarMIcon';
import { CheckmarkMIcon } from '@alfalab/icons-glyph/CheckmarkMIcon';
import { ChevronDownMIcon } from '@alfalab/icons-glyph/ChevronDownMIcon';
import { ChevronUpMIcon } from '@alfalab/icons-glyph/ChevronUpMIcon';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import hb from './assets/hb.jpg';
import img1 from './assets/img1.png';
import img2 from './assets/img2.png';
import img3 from './assets/img3.png';
import img4 from './assets/img4.png';
import img5 from './assets/img5.png';
import img6 from './assets/img6.png';
import p1Img from './assets/p1.png';
import p2Img from './assets/p2.png';
import p3Img from './assets/p3.png';
import p4Img from './assets/p4.png';
import rubIcon from './assets/rub.png';
import { LS, LSKeys } from './ls';
import { appSt } from './style.css';
import { ThxLayout } from './thx/ThxLayout';
import { sendDataToGA } from './utils/events';

const targets = [
  {
    title: 'Получать пассивный доход от накоплений',
    img: img1,
  },
  {
    title: 'Накопить на образование детей',
    img: img2,
  },
  {
    title: 'Выйти на пенсию досрочно',
    img: img3,
  },
  {
    title: 'Больше путешествовать',
    img: img4,
  },
  {
    title: 'Купить дом и жить у моря на пенсии',
    img: img5,
  },
  {
    title: 'Создать начальный капитал для детей',
    img: img6,
  },
];

const pluses = [
  {
    title: '0% налога',
    subtitle: 'На доход до 30 млн руб',
    img: p1Img,
  },
  {
    title: 'До 88 000 ₽',
    subtitle: 'Можно получить за счёт налогового вычета',
    img: p2Img,
  },
  {
    title: '21,56% годовых',
    subtitle: 'Инвестиционный доход за 2024 год',
    img: p3Img,
  },
  {
    title: 'Деньги под защитой',
    subtitle: 'Застрахованы на сумму до 2,8 млн ₽',
    img: p4Img,
  },
];

const faqs = [
  {
    question: 'Какую сумму нужно внести при оформлении договора?',
    answers: ['Счёт можно пополнять на любую сумму. А чтобы получать вычеты, счёт нельзя закрывать в течение пяти лет.'],
  },
  {
    question: 'Какие налоговые вычеты можно получить',
    answers: [
      'Вы можете получить сразу два вычета — на взнос и на доход. Чтобы их получать, ИИС‑3 нельзя закрывать в течение пяти лет.',
      'На взносы',
      'При вычете на взносы вы можете возвращать ежегодно:',
      'до 52 000 ₽, если платите 13% НДФЛ;',
      'до 60 000 ₽, если платите 15% НДФЛ.',
      'На доход',
      'При вычете на доход можно освободить полученный доход от сделок с ценными бумагами до 30 млн ₽, за исключением дивидендов при закрытии счёта.',
    ],
  },
  {
    question: 'Смогу забрать деньги раньше?',
    answers: ['Да, но только при закрытии ИИС и возврате полученных вычетов от государства.'],
  },
];

const INVEST_MIN = 2_000;
const INVEST_MAX = 3_000_000;

type OptionKey = 'per_month' | 'per_week' | 'per_quarter' | 'per_annual';

const OPTIONS = [
  { key: 'per_month', content: 'Раз в месяц' },
  { key: 'per_week', content: 'Раз в неделю' },
  { key: 'per_quarter', content: 'Раз в квартал' },
  { key: 'per_annual', content: 'Раз в год' },
];

export const App = () => {
  const [loading, setLoading] = useState(false);
  const [thxShow, setThx] = useState(LS.getItem(LSKeys.ShowThx, false));
  const [collapsedItems, setCollapsedItem] = useState<string[]>([]);
  const [steps, setSteps] = useState<'init' | 'sums'>();
  const [sum, setSum] = useState(INVEST_MIN);
  const [error, setError] = useState('');
  const [autoSum, setAutoSum] = useState(0);
  const [checked, setChecked] = useState(true);
  const [errorAutoSum, setErrorAutomSum] = useState('');
  const [payDate, setPayDate] = useState(dayjs().add(1, 'month').toDate().toISOString());
  const [openBs, setOpenBs] = useState(false);
  const [perItem, setPerItem] = useState<OptionKey>('per_month');

  useEffect(() => {
    if (!LS.getItem(LSKeys.UserId, null)) {
      LS.setItem(LSKeys.UserId, Date.now());
    }
  }, []);

  const submit = () => {
    setLoading(true);

    sendDataToGA({
      sum,
      autopayment_sum: checked ? autoSum : null,
      autopayment_frec: checked ? (OPTIONS.find(option => option.key === perItem)?.content ?? null) : null,
    }).then(() => {
      LS.setItem(LSKeys.ShowThx, true);
      setThx(true);
      setLoading(false);
    });
  };

  const handleChangeInput = (_: React.ChangeEvent<HTMLInputElement> | null, { value }: { value: number | null }) => {
    if (error) {
      setError('');
    }
    setSum(value ?? 0);
  };

  const handleChangeInputAutoSum = (_: React.ChangeEvent<HTMLInputElement> | null, { value }: { value: number | null }) => {
    if (errorAutoSum) {
      setErrorAutomSum('');
    }
    setAutoSum(value ?? 0);
  };

  const goNext = () => {
    window.gtag('event', '7132_next_click', { var: 'var5' });

    if (sum < INVEST_MIN || sum > INVEST_MAX) {
      setError(`От ${INVEST_MIN.toLocaleString('ru-RU')} до ${INVEST_MAX.toLocaleString('ru-RU')} ₽`);
      return;
    }

    if (!autoSum && checked) {
      setErrorAutomSum('Введите сумму автоплатежа');
      return;
    }
    submit();
  };

  if (thxShow) {
    return <ThxLayout />;
  }

  if (steps === 'sums') {
    return (
      <>
        <div className={appSt.container}>
          <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h1" view="medium" font="system" weight="semibold">
            Сумма взноса
          </Typography.TitleResponsive>
          <div>
            <Typography.Text view="primary-small" color="secondary" tag="p" defaultMargins={false}>
              Счёт списания
            </Typography.Text>

            <div className={appSt.bannerAccount}>
              <img src={rubIcon} width={48} height={48} alt="rubIcon" />

              <Typography.Text view="primary-small" weight="medium">
                Текущий счёт
              </Typography.Text>
            </div>
          </div>

          <AmountInput
            label="Сумма взноса"
            labelView="outer"
            value={sum}
            error={error}
            hint={`От ${INVEST_MIN.toLocaleString('ru-RU')} до ${INVEST_MAX.toLocaleString('ru-RU')} ₽`}
            onChange={handleChangeInput}
            block
            minority={1}
            bold={false}
          />

          <Switch block reversed checked={checked} label="Пополнять регулярно" onChange={() => setChecked(!checked)} />

          {checked && (
            <>
              <AmountInput
                label="Сумма автоплатежа"
                labelView="outer"
                value={autoSum}
                error={errorAutoSum}
                onChange={handleChangeInputAutoSum}
                block
                minority={1}
                bold={false}
              />

              <SelectMobile
                options={OPTIONS}
                label="Буду вносить"
                labelView="outer"
                block
                selected={perItem}
                onChange={p => setPerItem((p.selected?.key ?? 'per_month') as OptionKey)}
              />

              <Input
                label="Первый платёж"
                labelView="outer"
                value={payDate ? dayjs(payDate).format('DD.MM.YYYY') : undefined}
                disabled={!perItem}
                block
                rightAddons={<CalendarMIcon color="#898991" />}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  setOpenBs(true);
                }}
              />
            </>
          )}
        </div>

        <Gap size={96} />

        <div className={appSt.bottomBtn}>
          <Button block view="primary" onClick={goNext} loading={loading}>
            Продолжить
          </Button>
        </div>

        <CalendarMobile
          value={payDate ? dayjs(payDate).toDate().getTime() : undefined}
          selectorView={'full'}
          yearsAmount={2}
          onClose={() => setOpenBs(false)}
          open={openBs}
          minDate={dayjs().toDate().getTime()}
          maxDate={dayjs().add(2, 'year').toDate().getTime()}
          onChange={date => setPayDate(dayjs(date).toDate().toISOString())}
        />
      </>
    );
  }

  return (
    <>
      <div className={appSt.container}>
        <div className={appSt.boxHb}>
          <Typography.TitleResponsive tag="h1" view="xlarge" font="system" weight="semibold">
            ИИС
          </Typography.TitleResponsive>
          <img src={hb} alt="hb" height={199} width={309} style={{ objectFit: 'contain', marginBottom: '-25px' }} />
        </div>
        <div className={appSt.boxUnderHb}>
          <Typography.Text view="primary-medium">
            Более 2 млн пользователей
            <br />
            за 2025 оформили ИИС
          </Typography.Text>
        </div>

        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h4" view="small" font="system" weight="semibold">
          Описание программы:
        </Typography.TitleResponsive>
        <Typography.Text view="primary-medium">
          Индивидуальный инвестиционный счёт или ИИС — это специальный брокерский счёт с налоговыми льготами
        </Typography.Text>

        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h4" view="small" font="system" weight="semibold">
          Копите на любые цели и мечты
        </Typography.TitleResponsive>
        <div>
          <Swiper style={{ marginLeft: '0' }} spaceBetween={12} slidesPerView="auto">
            {targets.map((target, index) => (
              <SwiperSlide className={appSt.sliderContainer} key={index}>
                <div className={appSt.sliderBox}>
                  <img src={target.img} width="100%" height={112} style={{ marginTop: '-60px' }} alt={target.title} />
                  <Typography.Text view="primary-small" weight="bold" style={{ maxWidth: '180px' }}>
                    {target.title}
                  </Typography.Text>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h4" view="small" font="system" weight="semibold">
          Плюсы программы:
        </Typography.TitleResponsive>

        {pluses.map((adv, index) => (
          <PureCell key={index}>
            <PureCell.Graphics verticalAlign="center">
              <img src={adv.img} width={48} height={48} alt="house" />
            </PureCell.Graphics>
            <PureCell.Content>
              <PureCell.Main>
                <Typography.Text view="primary-medium" weight="bold">
                  {adv.title}
                </Typography.Text>

                <Typography.Text view="primary-medium" color="secondary">
                  {adv.subtitle}
                </Typography.Text>
              </PureCell.Main>
            </PureCell.Content>
          </PureCell>
        ))}

        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h4" view="small" font="system" weight="semibold">
          Как работает программа
        </Typography.TitleResponsive>

        <Steps isVerticalAlign interactive={false} className={appSt.stepStyle}>
          <span>
            <Typography.Text tag="p" defaultMargins={false} view="primary-medium">
              Вносите любую сумму
            </Typography.Text>
            <Typography.Text view="primary-small" color="secondary">
              Для удобства можно подключить автоплатёж
            </Typography.Text>
          </span>
          <span>
            <Typography.Text tag="p" defaultMargins={false} view="primary-medium">
              Государство возвращает налоговый вычет до 88 000 ₽
            </Typography.Text>
          </span>
          <span>
            <Typography.Text tag="p" defaultMargins={false} view="primary-medium">
              Инвестируйте деньги в акции и облигации и получайте доход
            </Typography.Text>
          </span>
        </Steps>

        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h4" view="small" font="system" weight="semibold">
          Деньги под защитой
        </Typography.TitleResponsive>

        <PureCell>
          <PureCell.Graphics verticalAlign="top">
            <CheckmarkMIcon color="#0D9336" />
          </PureCell.Graphics>
          <PureCell.Content>
            <PureCell.Main>
              <Typography.Text view="primary-medium">
                Застрахованы на сумму до 2,8 млн ₽ в Агентстве по страхованию вкладов
              </Typography.Text>
            </PureCell.Main>
          </PureCell.Content>
        </PureCell>

        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h4" view="small" font="system" weight="semibold">
          Какие налоговые вычеты можно получить
        </Typography.TitleResponsive>

        <Typography.Text view="primary-medium">
          <b>Вычет на взносы.</b> Позволяет вернуть 13% от суммы пополнений ИИС — до 52 000 ₽ в год. Чтобы получить вычет,
          нужно иметь официальный доход, облагаемый НДФЛ.
        </Typography.Text>
        <Typography.Text view="primary-medium">
          <b>Вычет на доход.</b> Освобождает от уплаты налога 13% с прибыли от сделок с ценными бумагами на сумму до 30 млн ₽
        </Typography.Text>

        <Typography.TitleResponsive style={{ marginTop: '1rem' }} tag="h4" view="small" font="system" weight="semibold">
          Частые вопросы
        </Typography.TitleResponsive>

        {faqs.map((faq, index) => (
          <div key={index}>
            <div
              onClick={() => {
                setCollapsedItem(items =>
                  items.includes(String(index + 1))
                    ? items.filter(item => item !== String(index + 1))
                    : [...items, String(index + 1)],
                );
              }}
              className={appSt.rowSb}
            >
              <Typography.Text view="primary-medium" weight="medium">
                {faq.question}
              </Typography.Text>
              {collapsedItems.includes(String(index + 1)) ? (
                <div style={{ flexShrink: 0 }}>
                  <ChevronUpMIcon />
                </div>
              ) : (
                <div style={{ flexShrink: 0 }}>
                  <ChevronDownMIcon />
                </div>
              )}
            </div>
            <Collapse expanded={collapsedItems.includes(String(index + 1))}>
              {faq.answers.map((answerPart, answerIndex) => (
                <Typography.Text key={answerIndex} tag="p" defaultMargins={false} view="primary-medium">
                  {answerPart}
                </Typography.Text>
              ))}
            </Collapse>
          </div>
        ))}
      </div>
      <Gap size={96} />

      <div className={appSt.bottomBtn}>
        <Button
          block
          view="primary"
          onClick={() => {
            setSteps('sums');
          }}
        >
          К оформлению
        </Button>
      </div>
    </>
  );
};
