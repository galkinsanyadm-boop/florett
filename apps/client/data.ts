import { Bouquet, Review } from './types';

export const categories: { id: string; label: string; value: string }[] = [
  { id: '1', label: 'Все букеты', value: 'all' },
  { id: '2', label: 'На свидание', value: 'date' },
  { id: '3', label: 'День рождения', value: 'birthday' },
  { id: '4', label: 'Свадьба', value: 'wedding' },
  { id: '5', label: 'Без повода', value: 'just-because' },
];

export const bouquets: Bouquet[] = [
  {
    id: 'b1',
    name: 'Утренний туман',
    price: 4500,
    category: 'date',
    images: [
      'https://i.ibb.co/Jj5VdLF9/Gemini-Generated-Image-njjfq8njjfq8njjf.png',
      'https://i.ibb.co/CpXnt9mK/Gemini-Generated-Image-i70a67i70a67i70a.png',
      'https://i.ibb.co/Q3vfr18S/Gemini-Generated-Image-dyw3uydyw3uydyw3.png'
    ],
    description: 'Нежный и воздушный букет в пастельных тонах. Идеально подходит для первого свидания или трепетного признания в чувствах.',
    composition: ['Пионовидные розы', 'Эустома', 'Эвкалипт', 'Маттиола'],
    size: '35 × 40 см'
  },
  {
    id: 'b2',
    name: 'Винтажная роза',
    price: 5200,
    category: 'birthday',
    images: [
      'https://i.ibb.co/kgQYbGKV/Gemini-Generated-Image-qpen7pqpen7pqpen.png',
      'https://i.ibb.co/8D1QPKbv/Gemini-Generated-Image-pae8bfpae8bfpae8.png',
      'https://i.ibb.co/yFTg0RDR/Gemini-Generated-Image-ruter6ruter6rute.png'
    ],
    description: 'Глубокие оттенки пыльной розы и бордо. Благородный выбор для подарка коллеге, маме или близкой подруге.',
    composition: ['Розы капучино', 'Астранция', 'Темная листва', 'Георгины'],
    size: '40 × 45 см'
  },
  {
    id: 'b3',
    name: 'Белоснежная мечта',
    price: 6800,
    category: 'wedding',
    images: [
      'https://images.unsplash.com/photo-1523694576729-dc99e9c0f9b4?q=80&w=1200&auto=format&fit=crop'
    ],
    description: 'Классика в современном прочтении. Охапка белых цветов, символизирующих чистоту и начало новой истории.',
    composition: ['Белые пионы', 'Гортензия', 'Ранункулюсы', 'Лентискус'],
    size: '45 × 50 см'
  },
  {
    id: 'b4',
    name: 'Летний полдень',
    price: 3200,
    category: 'just-because',
    images: [
      'https://i.ibb.co/2Y5qKXYd/get-photo-php-2.jpg',
      'https://i.ibb.co/PzcvW9b1/bd9421a6a220918c389641ef03c8a100-jpg.webp'
    ],
    description: 'Яркий, но не кричащий букет полевых цветов. Чтобы просто улыбнуться и напомнить о солнце.',
    composition: ['Ромашки', 'Танацетум', 'Васильки', 'Травы'],
    size: '30 × 35 см'
  },
  {
    id: 'b5',
    name: 'Персиковый закат',
    price: 4900,
    category: 'date',
    images: [
      'https://i.ibb.co/21pkVtTd/66b21bc43d6569-04729454-original.jpg',
      'https://i.ibb.co/FkNKYRyP/photo-2023-11-07-20-14-00.jpg'
    ],
    description: 'Теплые, обволакивающие оттенки персика и крема. Очень уютный букет.',
    composition: ['Розы Джульетта', 'Гвоздика сортовая', 'Лагурус'],
    size: '35 × 40 см'
  },
  {
    id: 'b6',
    name: 'Бохо шик',
    price: 7500,
    category: 'wedding',
    images: [
      'https://i.ibb.co/svqc8qVX/316602f1-4926-401b-9947-e26a28edd5ae.jpg',
      'https://i.ibb.co/RGGkTkHQ/protea-bouquet-closeup-jpg.webp'
    ],
    description: 'Свободная форма, много зелени и необычных текстур. Для свадеб в стиле рустик или бохо.',
    composition: ['Протея', 'Эвкалипт', 'Сухоцветы', 'Анемоны'],
    size: '50 × 55 см'
  }
];

export const reviews: Review[] = [
  {
    id: 'r1',
    author: 'Анастасия В.',
    rating: 5,
    date: '12 марта 2023',
    text: 'Заказывала "Утренний туман" для мамы. Она плакала от счастья! Цветы простояли почти две недели, каждый день раскрываясь по-новому. Спасибо за эту магию.',
    highlight: true
  },
  {
    id: 'r2',
    author: 'Михаил',
    rating: 5,
    date: '28 февраля 2025',
    text: 'Нужен был букет срочно, "на вчера". Девушки вошли в положение, собрали невероятную красоту за час. Сервис на высоте, чувствуется душа в каждом лепестке.',
  },
  {
    id: 'r3',
    author: 'Елена К.',
    rating: 5,
    date: '14 февраля 2021',
    text: 'Самые стильные букеты в городе. Никакой лишней упаковки, только естественность и вкус. Теперь за цветами только к вам.',
  },
  {
    id: 'r4',
    author: 'Дмитрий',
    rating: 4,
    date: '10 января 2022',
    text: 'Брал букет на свидание. Девушка была в восторге от аромата. Эвкалипт пахнет просто космос!',
  },
  {
    id: 'r5',
    author: 'Ольга',
    rating: 5,
    date: '5 апреля 2024',
    text: 'Заказывала оформление небольшой свадьбы. Всё получилось даже лучше, чем я представляла. Нежно, воздушно, как в сказке. Отдельное спасибо флористу Анне.',
    highlight: true
  },
  {
    id: 'r6',
    author: 'Виктория С.',
    rating: 5,
    date: '22 марта 2020',
    text: 'Тот случай, когда реальность превзошла ожидание. В жизни букеты еще красивее, чем на фото. Спасибо, Florett!',
  },
  {
    id: 'r7',
    author: 'Максим',
    rating: 5,
    date: '18 сентября 2024',
    text: 'Делал предложение с вашим букетом. Она сказала "да"! Спасибо за то, что помогли сделать этот момент идеальным.',
    highlight: true
  },
  {
    id: 'r8',
    author: 'Алина',
    rating: 5,
    date: '30 ноября 2021',
    text: 'Заказываю здесь уже третий год. Всегда свежие, стоят долго, а упаковка — отдельный вид искусства. Никакого целлофана, только крафт и ленты.',
  },
  {
    id: 'r9',
    author: 'Сергей П.',
    rating: 5,
    date: '15 июля 2025',
    text: 'Очень вежливые курьеры и пунктуальная доставка. Букет "Винтажная роза" в жизни выглядит еще благороднее. Жена в восторге.',
  }
];
