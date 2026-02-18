// npm install lucide-react recharts

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Check, 
  X, 
  Home, 
  RotateCcw, 
  BookOpen, 
  AlertCircle, 
  Trophy, 
  ChevronRight, 
  List,
  Flag
} from 'lucide-react';

// ==========================================
// データ定義 (添付ファイルに基づく全問題)
// ==========================================

const QUESTIONS_DATA = [
  {
    id: 1,
    year: "平成30年 第23問",
    title: "商圏分析（ライリーの法則・計算要素）",
    question: "商圏分析として、Ａ市およびＢ市がその中間に位置するＸ町から吸引する購買額の割合を、ライリーの法則に基づいて求めたい。その計算に必要な比率として、最も適切なものの組み合わせを下記の解答群から選べ。",
    choices: [
      "ａとｃ",
      "ａとｄ",
      "ｂとｃ",
      "ｂとｄ"
    ],
    conditions: [
      "ａ　「Ａ市の人口」と「Ｂ市の人口」の比率",
      "ｂ　「Ａ市の面積」と「Ｂ市の面積」の比率",
      "ｃ　「Ａ市とＸ町の距離」と「Ｂ市とＸ町の距離」の比率",
      "ｄ　「Ａ市とＸ町の住民の総所得の差」と「Ｂ市とＸ町の住民の総所得の差」の比率"
    ],
    correctIndex: 0,
    explanation: "ライリーの法則は、2つの都市に流れる購買金額の割合は「都市の人口に比例し、距離の2乗に反比例する」と定義しています。\n\n式：(A市の吸引力 / B市の吸引力) = (A市人口 / B市人口) × (B市までの距離 / A市までの距離)²\n\nしたがって、計算に必要な要素は「人口（a）」と「距離（c）」です。「面積（b）」や「所得の差（d）」は計算式に含まれません。"
  },
  {
    id: 2,
    year: "令和4年 第25問",
    title: "商圏分析（ライリーの法則・計算）",
    question: "Ａ市とＢ市が、その中間にあるＸ町からどの程度の購買力を吸引するかを求めたい。下図の条件が与えられたとき、ライリーの法則を用いてＡ市とＢ市がＸ町から吸引する購買力の比率を求める場合、最も適切なものを解答群から選べ。",
    hasDiagram: true,
    diagramType: "riley_diagram",
    choices: [
      "Ａ市：Ｂ市 ＝ 1 ： 1",
      "Ａ市：Ｂ市 ＝ 2 ： 1",
      "Ａ市：Ｂ市 ＝ 1 ： 2",
      "Ａ市：Ｂ市 ＝ 8 ： 1",
      "Ａ市：Ｂ市 ＝ 1 ： 8"
    ],
    correctIndex: 0,
    explanation: "ライリーの法則の公式に当てはめます。\n\n吸引比率 = (A市人口 / B市人口) × (B市距離 / A市距離)²\n= (20万人 / 5万人) × (6km / 12km)²\n= 4 × (1/2)²\n= 4 × 1/4\n= 1\n\nよって、比率は 1：1 となります。"
  },
  {
    id: 3,
    year: "令和3年 第24問",
    title: "修正ハフモデル",
    question: "ある地域に住む消費者Ｘが、ある店舗に買い物に出かける確率を考えたい。修正ハフモデルを用いて店舗Ａに買い物に出かける確率を求める場合、最も適切なものを選べ。なお、店舗の魅力度については売場面積を使用する。",
    hasDiagram: true,
    diagramType: "huff_data",
    choices: [
      "1/2",
      "1/3",
      "2/3",
      "1/4"
    ],
    correctIndex: 2,
    explanation: "修正ハフモデルでは、確率 = (当該店舗の効用) / (全店舗の効用の合計) で求めます。\n効用 = 売場面積 / (距離)^λ （本問では距離抵抗係数λ=2）\n\n【店舗Aの効用】1000 / (1000)² = 1000 / 1,000,000 = 0.001\n【店舗Bの効用】2000 / (2000)² = 2000 / 4,000,000 = 0.0005\n\n【Aに行く確率】\n0.001 / (0.001 + 0.0005) = 0.001 / 0.0015 = 10 / 15 = 2/3"
  },
  {
    id: 4,
    year: "平成29年 第29問",
    title: "ワンウェイコントロール",
    question: "セルフサービス店舗のフロアレイアウトにおけるワンウェイコントロールに関する記述として、最も適切なものはどれか。",
    choices: [
      "売れ筋商品を見えやすい位置に陳列して、買上率を高めること。",
      "買物客の売場回遊を促進して、商品との接点を増やすこと。",
      "商品の陳列スペースを最適化して、店員の商品補充頻度を減らすこと。",
      "商品を買物しやすい順に配置して、買い物客の店内動線長を最短にすること。",
      "レジ前の売場に低価格商品を陳列して、衝動購買を促進すること。"
    ],
    correctIndex: 1,
    explanation: "ワンウェイコントロールとは、客動線を制御し、買物客に店内をくまなく歩いてもらう（回遊性を高める）ことで、商品との接触頻度を増やし、買上点数・客単価を向上させる手法です。\n\n動線を「最短」にする（エ）のではなく、あえて長く回遊させることが目的です。"
  },
  {
    id: 5,
    year: "平成28年 第30問",
    title: "商品分類（最寄品・買回品・専門品）",
    question: "消費者の購買慣習からみた商品分類と、その特徴の記述の組み合わせとして、最も適切なものを選べ。",
    conditions: [
      "a：消費者は商品へのこだわりがあり、複数の店舗を比較して買う。",
      "b：消費者は手近にある情報により、買うことを決める。",
      "c：消費者は時間をかけることを惜しまずに、遠方の店舗でも買いに行く。"
    ],
    choices: [
      "買回品 － b",
      "専門品 － b",
      "専門品 － c",
      "最寄品 － a",
      "最寄品 － c"
    ],
    correctIndex: 2,
    explanation: "各分類の特徴は以下の通りです。\n\n・最寄品（日用品など）：最寄りの店舗で手近な情報で買う（b）。\n・買回品（家電・衣料など）：複数店舗を比較検討して買う（a）。\n・専門品（高級車・ブランド品など）：遠方でも時間をかけて買いに行く（c）。\n\nしたがって、「専門品 － c」の組み合わせが適切です。"
  },
  {
    id: 6,
    year: "平成27年 第30問",
    title: "動線長",
    question: "小売店舗において客の動線長をのばすための施策として、最も適切なものはどれか。",
    choices: [
      "計画購買率の高い商品を店舗の奥に配置する。",
      "ゴールデンラインを複数設置する。",
      "チラシ掲載の特売商品を店舗の入口付近に配置する。",
      "パワーカテゴリーを集中配置する。"
    ],
    correctIndex: 0,
    explanation: "目的来店性の高い（計画購買率の高い）商品を店舗の奥（マグネットポイント）に配置することで、顧客はそこまで歩く必要が生じ、結果として動線が伸び、途中で他の商品を目にする機会が増えます。\n\n特売品を入口に置く（ウ）と、それだけ買って帰ってしまうため動線は短くなります。"
  },
  {
    id: 7,
    year: "平成27年 第25問",
    title: "照明の基礎用語1",
    question: "店舗施設の売場を演出する照明の説明に関して、空欄Ａ〜Ｃに入る語句として最も適切な組み合わせを選べ。\n\n「照明光の性質を知る代表的なものとして、光源に照らされた明るさを表す【 Ａ 】、光源の色みを表す【 Ｂ 】がある。また、光で照明された物体の色の見え方を【 Ｃ 】という。」",
    choices: [
      "Ａ：演色　Ｂ：光色　Ｃ：照度",
      "Ａ：光色　Ｂ：演色　Ｃ：照度",
      "Ａ：光色　Ｂ：照度　Ｃ：演色",
      "Ａ：照度　Ｂ：演色　Ｃ：光色",
      "Ａ：照度　Ｂ：光色　Ｃ：演色"
    ],
    correctIndex: 4,
    explanation: "・照度：照らされた場所の明るさ（単位：ルクス）。\n・光色：光源そのものの色味（色温度で表される）。\n・演色：光に照らされた物体の「色の見え方」（演色評価数で表される）。\n\nしたがって、A:照度、B:光色、C:演色が正解です。"
  },
  {
    id: 8,
    year: "平成30年 第24問",
    title: "照明の基礎用語2（JIS基準）",
    question: "照明の基礎知識に関する解説の空欄Ａ〜Ｃに入る語句または数値として、最も適切な組み合わせを選べ。\n\n「照度とは…一般的に【 A 】の単位で表される。…商店の重要陳列部は750【 A 】であり、大型店の重要陳列部は【 B 】【 A 】である。\n照明された物の色の見え方を表す…JISでは【 C 】が用いられている。」",
    choices: [
      "Ａ：ルクス　Ｂ：500　Ｃ：平均光色評価数",
      "Ａ：ルクス　Ｂ：2,000　Ｃ：平均演色評価数",
      "Ａ：ルクス　Ｂ：2,000　Ｃ：平均光色評価数",
      "Ａ：ワット　Ｂ：500　Ｃ：平均演色評価数",
      "Ａ：ワット　Ｂ：2,000　Ｃ：平均演色評価数"
    ],
    correctIndex: 1,
    explanation: "A：照度の単位は「ルクス（lx）」です。\nB：JIS基準において、大型店（デパート等）の重要陳列部の推奨維持照度は「2,000」lxです（商店より明るくあるべき）。\nC：色の見え方の指標は「平均演色評価数（Ra）」です。「平均光色評価数」という用語はありません。"
  },
  {
    id: 9,
    year: "令和2年 第23問",
    title: "大規模小売店舗立地法",
    question: "大規模小売店舗立地法に関する記述として、最も適切なものはどれか。",
    choices: [
      "この法律では、店舗に設置されている消火器具や火災報知設備などの機器点検は、6か月に1回行わなければならないと定められている。",
      "この法律の主な目的は、大規模小売店舗における小売業の事業活動を調整することにより、その周辺の中小小売業の事業活動の機会を適正に確保することである。",
      "この法律の対象は店舗面積が500m²を超える小売業を営むための店舗であり、飲食店は含まれない。",
      "市町村は、大規模小売店舗の設置者が正当な理由がなく勧告に従わない場合、その旨を公表することができる。",
      "大規模小売店舗を設置するものが配慮すべき事項として、交通の渋滞や交通安全、騒音、廃棄物などに関する事項が挙げられている。"
    ],
    correctIndex: 4,
    explanation: "ア：消防法の規定です。\nイ：これは旧・大規模小売店舗法（大店法）の目的（中小保護）です。現在の立地法は「周辺の生活環境の保持」が目的です。\nウ：対象は店舗面積「1,000m²」超です。\nエ：公表の権限を持つのは原則として「都道府県」です。\nオ：適切です。立地法は交通、騒音、廃棄物などの「生活環境」への配慮を求めています。"
  },
  {
    id: 10,
    year: "令和4年 第23問",
    title: "中心市街地活性化法",
    question: "中心市街地活性化法に関する記述として、最も適切なものはどれか。",
    choices: [
      "この法律では、居住誘導区域の中に都市機能誘導区域を定める必要がある。",
      "この法律の対象となる区域を地区とする商工会または商工会議所は、当該区域の中心市街地活性化協議会を組織することができない。",
      "この法律の目的は、大規模小売店舗の立地に関して、その周辺の地域の生活環境の保持をすることである。",
      "中心市街地整備推進機構の役割の1つは、中心市街地活性化にかかわる情報の提供、相談、その他の援助などである。",
      "都道府県は、政府が定めた基本方針に基づき、基本計画を作成し、経済産業大臣の認定を申請することができる。"
    ],
    correctIndex: 3,
    explanation: "ア：都市再生特別措置法の規定です。\nイ：商工会・商工会議所は協議会を組織「できます」。\nウ：大規模小売店舗立地法の目的です。\nエ：適切です。中心市街地整備推進機構の業務として規定されています。\nオ：基本計画を作成するのは「市町村」、認定申請先は「内閣総理大臣」です。"
  },
  {
    id: 11,
    year: "令和元年 第23問",
    title: "用途地域（2,000m²スーパー）",
    question: "都市計画法および建築基準法において、床面積が2,000m²のスーパーマーケットを建築できる用途地域の組み合わせとして、最も適切なものはどれか。",
    hasDiagram: true,
    diagramType: "zoning_table_simple",
    choices: [
      "工業専用地域と商業地域",
      "第一種住居地域と商業地域",
      "第一種住居地域と第二種中高層住居専用地域",
      "第二種中高層住居専用地域と近隣商業地域",
      "第二種低層住居専用地域と準工業地域"
    ],
    correctIndex: 1,
    explanation: "2,000m²の店舗が建築可能な地域を判断します。\n\n・商業地域：建築可能。\n・第一種住居地域：3,000m²以下なら建築可能。\n・第二種中高層住居専用地域：1,500m²以下（2階以下）まで。2,000m²は不可。\n・工業専用地域：店舗は原則不可。\n\nしたがって、両方可能なのは「第一種住居地域と商業地域」です。"
  },
  {
    id: 12,
    year: "平成27年 第23問",
    title: "用途地域（面積制限）",
    question: "都市計画法および建築基準法による用途地域に関する説明として、最も適切なものはどれか。",
    choices: [
      "床面積が1,000m²の店舗の場合、第一種低層住居専用地域に出店することができる。",
      "床面積が2,000m²の店舗の場合、第二種中高層住居専用地域に出店することができる。",
      "床面積が5,000m²の店舗の場合、第一種住居地域に出店することができる。",
      "床面積が12,000m²の店舗の場合、準住居地域に出店することができる。",
      "床面積が15,000m²の店舗の場合、近隣商業地域に出店することができる。"
    ],
    correctIndex: 4,
    explanation: "ア：第一種低層は原則兼用住宅で50m²以下などが限度。1,000m²は不可。\nイ：第二種中高層は1,500m²以下まで。2,000m²は不可。\nウ：第一種住居は3,000m²以下まで。5,000m²は不可。\nエ：準住居は10,000m²以下まで。12,000m²は不可。\nオ：近隣商業地域は店舗面積の制限がないため、15,000m²でも出店可能。正解。"
  },
  {
    id: 13,
    year: "平成30年 第25問",
    title: "地域商店街活性化法",
    question: "地域商店街活性化法および同法に基づく商店街活性化事業に関する記述として、最も不適切なものはどれか。",
    choices: [
      "商店街活性化事業の成果として、商店街への来訪者の増加に着目している。",
      "商店街活性化事業は、第1に地域住民の需要に応じて行う事業であること、第2に商店街活性化の効果が見込まれること、第3に他の商店街にとって参考となり得る事業であること、以上の3点を満たす必要がある。",
      "商店街活性化事業は、ハード事業のみによる振興を基本的な目的にしている。",
      "商店街は、地域コミュニティの担い手としての役割を発揮することを期待されている。"
    ],
    correctIndex: 2,
    explanation: "地域商店街活性化法は、ソフト事業（イベントやサービス開発など）を含めた取り組みを支援するものです。「ハード事業（施設整備など）のみ」を目的としているわけではありません。\n\n「活性化」にはソフト面での工夫が不可欠であるというのが法の趣旨です。"
  }
];

// ==========================================
// コンポーネント: 図解レンダラー
// ==========================================

const DiagramRenderer = ({ type }) => {
  if (type === "riley_diagram") {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-white border rounded-lg my-4">
        <div className="flex items-center justify-between w-full max-w-lg">
          {/* A市 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center bg-white text-xl font-bold shadow-sm">
              A市
            </div>
            <div className="mt-2 text-sm text-gray-600">人口: 20万人</div>
          </div>
          
          {/* 線と距離 */}
          <div className="flex-1 flex flex-col items-center relative -mx-4">
             <div className="border-t-2 border-black w-full absolute top-1/2 transform -translate-y-1/2"></div>
             <div className="bg-white px-2 z-10 mb-6 text-sm font-semibold">12 km</div>
          </div>

          {/* X町 */}
          <div className="flex flex-col items-center z-10 mx-2">
            <div className="w-16 h-16 border-2 border-black flex items-center justify-center bg-white text-lg font-bold shadow-sm">
              X町
            </div>
          </div>

          {/* 線と距離 */}
          <div className="flex-1 flex flex-col items-center relative -mx-4">
             <div className="border-t-2 border-black w-full absolute top-1/2 transform -translate-y-1/2"></div>
             <div className="bg-white px-2 z-10 mb-6 text-sm font-semibold">6 km</div>
          </div>

          {/* B市 */}
          <div className="flex flex-col items-center z-10">
            <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center bg-white text-xl font-bold shadow-sm">
              B市
            </div>
            <div className="mt-2 text-sm text-gray-600">人口: 5万人</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === "huff_data") {
    return (
      <div className="w-full overflow-x-auto my-4 border rounded bg-white p-4">
        <h4 className="font-bold text-gray-700 mb-2">条件データ</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="border p-3 rounded">
            <div className="font-bold border-b pb-1 mb-2">店舗A</div>
            <div>売場面積: 1,000 m²</div>
            <div>消費者Xとの距離: 1,000 m</div>
          </div>
          <div className="border p-3 rounded">
            <div className="font-bold border-b pb-1 mb-2">店舗B</div>
            <div>売場面積: 2,000 m²</div>
            <div>消費者Xとの距離: 2,000 m</div>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600 text-center">
          ※距離抵抗係数: 2
        </div>
      </div>
    );
  }

  if (type === "zoning_table_simple") {
    return (
      <div className="w-full my-4 text-sm">
         <div className="bg-blue-50 p-3 rounded border border-blue-100 text-blue-800 mb-2">
            <strong>ヒント: </strong>スーパーマーケット（店舗）の建築制限イメージ
         </div>
         <div className="overflow-x-auto">
          <table className="min-w-full border text-center text-xs md:text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">用途地域</th>
                <th className="border p-2">1500m²以下</th>
                <th className="border p-2">3000m²以下</th>
                <th className="border p-2">制限なし</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2 text-left bg-gray-50">第2種中高層住居</td>
                <td className="border p-2 text-green-600 font-bold">○</td>
                <td className="border p-2 text-red-400">×</td>
                <td className="border p-2 text-red-400">×</td>
              </tr>
              <tr>
                <td className="border p-2 text-left bg-gray-50">第1種住居</td>
                <td className="border p-2 text-green-600 font-bold">○</td>
                <td className="border p-2 text-green-600 font-bold">○</td>
                <td className="border p-2 text-red-400">×</td>
              </tr>
              <tr>
                <td className="border p-2 text-left bg-gray-50">商業地域</td>
                <td className="border p-2 text-green-600 font-bold">○</td>
                <td className="border p-2 text-green-600 font-bold">○</td>
                <td className="border p-2 text-green-600 font-bold">○</td>
              </tr>
               <tr>
                <td className="border p-2 text-left bg-gray-50">工業専用</td>
                <td className="border p-2 text-red-400">×</td>
                <td className="border p-2 text-red-400">×</td>
                <td className="border p-2 text-red-400">×</td>
              </tr>
            </tbody>
          </table>
         </div>
      </div>
    );
  }

  return null;
};

// ==========================================
// メインアプリケーション
// ==========================================

export default function App() {
  // --- State Management ---
  const [currentMode, setCurrentMode] = useState('start'); // start, quiz, result, history
  const [questionList, setQuestionList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // LocalStorage Data
  const [history, setHistory] = useState({}); // { [id]: { isCorrect: boolean, lastDate: string } }
  const [reviewList, setReviewList] = useState({}); // { [id]: boolean }

  // --- Initialization & Storage Logic ---
  useEffect(() => {
    // データ読み込み (防衛的コーディング)
    try {
      const savedHistory = localStorage.getItem('quizApp_history');
      const savedReviews = localStorage.getItem('quizApp_reviews');
      
      if (savedHistory) setHistory(JSON.parse(savedHistory));
      if (savedReviews) setReviewList(JSON.parse(savedReviews));
      
      console.log('Data loaded from LocalStorage');
    } catch (e) {
      console.error('LocalStorage error:', e);
      setHistory({});
      setReviewList({});
    }
  }, []);

  useEffect(() => {
    // データ保存
    try {
      localStorage.setItem('quizApp_history', JSON.stringify(history));
      localStorage.setItem('quizApp_reviews', JSON.stringify(reviewList));
    } catch (e) {
      console.error('Save failed:', e);
    }
  }, [history, reviewList]);

  // --- Logic Helpers ---

  const startQuiz = (mode) => {
    let filteredQuestions = [];

    if (mode === 'all') {
      filteredQuestions = [...QUESTIONS_DATA];
    } else if (mode === 'incorrect') {
      filteredQuestions = QUESTIONS_DATA.filter(q => {
        const h = history[q.id];
        return h && !h.isCorrect;
      });
    } else if (mode === 'review') {
      filteredQuestions = QUESTIONS_DATA.filter(q => reviewList[q.id]);
    }

    if (filteredQuestions.length === 0) {
      alert("該当する問題がありません。");
      return;
    }

    // シャッフルしたい場合はここで実施（今回はID順維持）
    setQuestionList(filteredQuestions);
    setCurrentIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCurrentMode('quiz');
    console.log(`Quiz started: Mode=${mode}, Questions=${filteredQuestions.length}`);
  };

  const handleAnswer = (choiceIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(choiceIndex);
    setIsAnswered(true);

    const currentQ = questionList[currentIndex];
    const isCorrect = choiceIndex === currentQ.correctIndex;

    if (isCorrect) setScore(prev => prev + 1);

    // 履歴更新
    setHistory(prev => ({
      ...prev,
      [currentQ.id]: {
        isCorrect: isCorrect,
        lastDate: new Date().toISOString()
      }
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questionList.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setCurrentMode('result');
    }
  };

  const toggleReview = (id) => {
    setReviewList(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // --- Render Helpers ---
  const currentQ = questionList[currentIndex];
  const isReviewing = currentQ ? reviewList[currentQ.id] : false;

  // --- Screens ---

  const StartScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-in fade-in duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-blue-900">店舗立地と店舗設計</h1>
        <p className="text-gray-500">過去問セレクト演習 3-7</p>
      </div>

      <div className="grid gap-4 w-full max-w-sm">
        <button 
          onClick={() => startQuiz('all')}
          className="flex items-center justify-between p-4 bg-white border-2 border-blue-100 rounded-xl hover:border-blue-500 hover:shadow-lg transition-all group"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <List size={24} />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800">すべての問題</div>
              <div className="text-xs text-gray-500">全{QUESTIONS_DATA.length}問</div>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
        </button>

        <button 
          onClick={() => startQuiz('incorrect')}
          className="flex items-center justify-between p-4 bg-white border-2 border-red-50 rounded-xl hover:border-red-400 hover:shadow-lg transition-all group"
        >
           <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 text-red-600 rounded-lg group-hover:bg-red-500 group-hover:text-white transition-colors">
              <AlertCircle size={24} />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800">前回不正解</div>
              <div className="text-xs text-gray-500">復習が必要な問題</div>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-red-500" />
        </button>

        <button 
          onClick={() => startQuiz('review')}
          className="flex items-center justify-between p-4 bg-white border-2 border-yellow-50 rounded-xl hover:border-yellow-400 hover:shadow-lg transition-all group"
        >
           <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg group-hover:bg-yellow-500 group-hover:text-white transition-colors">
              <Flag size={24} />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-800">要復習リスト</div>
              <div className="text-xs text-gray-500">チェックした問題のみ</div>
            </div>
          </div>
          <ChevronRight className="text-gray-300 group-hover:text-yellow-500" />
        </button>
      </div>

      <button 
        onClick={() => setCurrentMode('history')}
        className="text-gray-400 hover:text-gray-600 underline text-sm"
      >
        学習履歴を見る
      </button>
    </div>
  );

  const QuizScreen = () => {
    if (!currentQ) return <div>Loading...</div>;

    const isCorrect = selectedAnswer === currentQ.correctIndex;

    return (
      <div className="w-full max-w-3xl mx-auto pb-20">
        {/* Header Info */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-bold">
              Q.{currentIndex + 1}
            </span>
            <span className="text-xs font-medium text-gray-500 border px-2 py-1 rounded bg-gray-50">
              {currentQ.year}
            </span>
          </div>
          <div className="text-sm font-medium text-gray-400">
             {currentIndex + 1} / {questionList.length}
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4 leading-relaxed">
            {currentQ.question}
          </h2>

          {currentQ.conditions && (
             <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm space-y-1 text-gray-700">
               {currentQ.conditions.map((c, i) => <div key={i}>{c}</div>)}
             </div>
          )}

          {currentQ.hasDiagram && (
            <DiagramRenderer type={currentQ.diagramType} />
          )}

          {/* Choices */}
          <div className="space-y-3 mt-6">
            {currentQ.choices.map((choice, idx) => {
              let btnClass = "w-full p-4 text-left rounded-lg border-2 transition-all ";
              if (!isAnswered) {
                btnClass += "border-gray-100 hover:border-blue-400 hover:bg-blue-50";
              } else {
                if (idx === currentQ.correctIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-800 font-bold";
                } else if (idx === selectedAnswer) {
                  btnClass += "border-red-400 bg-red-50 text-red-800";
                } else {
                  btnClass += "border-gray-100 opacity-50";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(idx)}
                  className={btnClass}
                >
                  <div className="flex items-center">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center mr-3 text-xs">
                      {['ア', 'イ', 'ウ', 'エ', 'オ'][idx]}
                    </span>
                    {choice}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Explanation Area */}
        {isAnswered && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <div className={`p-6 rounded-xl border-l-4 shadow-sm mb-6 ${isCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {isCorrect ? <Check className="text-green-600" /> : <X className="text-red-600" />}
                  <span className={`font-bold text-lg ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? '正解！' : '不正解...'}
                  </span>
                </div>
                <button 
                  onClick={() => toggleReview(currentQ.id)}
                  className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-full border ${isReviewing ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-white text-gray-500 border-gray-200'}`}
                >
                  <Flag size={14} fill={isReviewing ? "currentColor" : "none"} />
                  <span>{isReviewing ? '要復習リスト入' : '後で復習する'}</span>
                </button>
              </div>
              
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                <div className="font-bold mb-2">【解説】</div>
                {currentQ.explanation}
              </div>
            </div>
            
            <button
              onClick={nextQuestion}
              className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2"
            >
              <span>次の問題へ</span>
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    );
  };

  const ResultScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 animate-in zoom-in-95">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">お疲れ様でした！</h2>
        <div className="text-5xl font-black text-blue-600 mb-2">
          {score} <span className="text-xl text-gray-400 font-medium">/ {questionList.length}</span>
        </div>
        <p className="text-gray-500 text-sm mb-6">正答率: {Math.round((score / questionList.length) * 100)}%</p>
        
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setCurrentMode('start')}
            className="flex items-center justify-center space-x-2 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Home size={18} />
            <span>トップへ</span>
          </button>
          <button 
            onClick={() => startQuiz('incorrect')}
            className="flex items-center justify-center space-x-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <RotateCcw size={18} />
            <span>再挑戦</span>
          </button>
        </div>
      </div>
    </div>
  );

  const HistoryScreen = () => (
    <div className="w-full max-w-3xl mx-auto pb-10">
      <div className="flex items-center mb-6">
        <button onClick={() => setCurrentMode('start')} className="p-2 hover:bg-gray-100 rounded-full mr-2">
          <ChevronRight className="rotate-180" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">学習履歴一覧</h2>
      </div>

      <div className="space-y-3">
        {QUESTIONS_DATA.map((q) => {
          const hist = history[q.id];
          const isRev = reviewList[q.id];
          
          return (
            <div key={q.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-start justify-between">
              <div className="flex-1 pr-4">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-bold bg-gray-100 px-2 py-0.5 rounded text-gray-600">No.{q.id}</span>
                  <span className="text-xs text-gray-400">{q.year}</span>
                  {isRev && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded flex items-center"><Flag size={10} className="mr-1" fill="currentColor"/>要復習</span>}
                </div>
                <div className="text-sm text-gray-800 font-medium line-clamp-2">{q.question}</div>
              </div>
              
              <div className="flex flex-col items-end space-y-2">
                {hist ? (
                  hist.isCorrect ? 
                    <span className="flex items-center text-green-600 text-sm font-bold"><Check size={16} className="mr-1"/>正解</span> : 
                    <span className="flex items-center text-red-500 text-sm font-bold"><X size={16} className="mr-1"/>不正解</span>
                ) : (
                  <span className="text-gray-300 text-sm">-</span>
                )}
                
                <button 
                  onClick={() => toggleReview(q.id)}
                  className={`p-1.5 rounded hover:bg-gray-100 ${isRev ? 'text-yellow-500' : 'text-gray-300'}`}
                >
                  <Flag size={18} fill={isRev ? "currentColor" : "none"} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <div className="max-w-4xl mx-auto min-h-screen px-4 py-8">
        {currentMode === 'start' && <StartScreen />}
        {currentMode === 'quiz' && <QuizScreen />}
        {currentMode === 'result' && <ResultScreen />}
        {currentMode === 'history' && <HistoryScreen />}
      </div>
    </div>
  );
}