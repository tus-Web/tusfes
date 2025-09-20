'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FilterList, LocationOn, Clear } from '@mui/icons-material';
import { Button, Chip, Menu, MenuItem, FormControlLabel, Checkbox, Divider } from '@mui/material';
import ExhibitionModal from '../ExhibitionModal/ExhibitionModal';
import styles from './MapPage.module.css';

interface ExhibitionItem {
  id: number;
  name: string;
  type: string;
  subType?: string;
  position: { x: number; y: number };
  targetAudience: string[];
  description: string;
  detailedDescription: string;
  location: string;
  schedule: string;
  capacity?: number;
  organizer: string;
  imageUrl?: string;
  tags: string[];
}

interface MapPageProps {
  onLocationSelect: (location: ExhibitionItem) => void;
}

const mockExhibitions: ExhibitionItem[] = [
  {
    id: 1,
    name: '化学実験ショー',
    type: '展示',
    subType: '科学実験',
    position: { x: 25, y: 30 },
    targetAudience: ['子供向け', '高校生'],
    description: '目の前で化学反応が起きるエンタメ性の高いサイエンスショー',
    detailedDescription: '化学の不思議な世界を体験できる参加型実験ショーです。色が変わる反応、泡が出る実験、光る化学反応など、見て楽しい実験を多数ご用意しています。小さなお子様から大人まで楽しめる内容で、化学への興味を深めるきっかけとなることでしょう。実験は安全に配慮して行われ、専門の学生スタッフが丁寧に説明いたします。',
    location: '1号館 実験室A',
    schedule: '10:00-17:00 (30分毎)',
    capacity: 50,
    organizer: '化学研究会',
    imageUrl: 'https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['子供向け', '展示', '科学実験']
  },
  {
    id: 2,
    name: 'AIロボット展示',
    type: '展示',
    subType: 'テクノロジー',
    position: { x: 60, y: 45 },
    targetAudience: ['高校生', '大学生'],
    description: 'AI、ロボット、VR/ARなど最新技術の展示',
    detailedDescription: '最新のAI技術とロボット工学の成果を展示しています。自律走行ロボット、音声認識AI、画像認識システムなど、実際に動作するデモンストレーションをご覧いただけます。また、VRゴーグルを使った仮想現実体験や、ARアプリケーションの実演も行っています。未来の技術を肌で感じることができる貴重な機会です。',
    location: '2号館 展示ホール',
    schedule: '9:00-18:00',
    capacity: 100,
    organizer: 'ロボット工学研究室',
    imageUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['高校生', '大学生', '展示', 'テクノロジー']
  },
  {
    id: 3,
    name: '情報工学研究室公開',
    type: '展示',
    subType: '研究室',
    position: { x: 40, y: 70 },
    targetAudience: ['大学生'],
    description: '各学科の研究室が行う一般公開。専門的な内容に触れられます',
    detailedDescription: '情報工学科の各研究室が取り組んでいる最先端の研究内容を公開しています。機械学習、データサイエンス、ネットワークセキュリティ、ソフトウェア工学など、幅広い分野の研究成果をご紹介します。大学院生や教授による詳しい説明を聞くことができ、将来の進路選択の参考にもなります。研究に興味のある学生の皆さんは是非お越しください。',
    location: '3号館 研究室フロア',
    schedule: '10:00-16:00',
    organizer: '情報工学科',
    imageUrl: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['大学生', '展示', '研究室']
  },
  {
    id: 4,
    name: 'フードコート',
    type: 'フード',
    position: { x: 75, y: 25 },
    targetAudience: ['子供向け', '高校生', '大学生'],
    description: '美味しい食事を楽しめます',
    detailedDescription: '理大祭の定番グルメから新しいメニューまで、バラエティ豊かな食事を提供しています。学生サークルが運営する手作りの料理、地元の人気店による出店、そして理科大オリジナルメニューなど、多彩な選択肢をご用意しています。アレルギー対応メニューもありますので、安心してお食事をお楽しみください。',
    location: '中庭特設会場',
    schedule: '11:00-20:00',
    organizer: '学園祭実行委員会',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['子供向け', '高校生', '大学生', 'フード']
  },
  {
    id: 5,
    name: '美術部作品展',
    type: '展示',
    subType: 'アート・文化',
    position: { x: 20, y: 60 },
    targetAudience: ['子供向け', '高校生'],
    description: '美術部、写真部などの作品展示',
    detailedDescription: '美術部、写真部、書道部などの文化系サークルによる作品展示会です。油絵、水彩画、デジタルアート、写真作品、書道作品など、学生たちの創造性あふれる作品を多数展示しています。また、ワークショップコーナーでは、簡単な絵画体験や写真撮影のコツを学ぶことができます。芸術に触れる素晴らしい機会をお見逃しなく。',
    location: '1号館 ギャラリー',
    schedule: '9:00-17:00',
    organizer: '美術部・写真部',
    imageUrl: 'https://images.pexels.com/photos/1266808/pexels-photo-1266808.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['子供向け', '高校生', '展示', 'アート・文化']
  },
  {
    id: 6,
    name: '軽音楽部ライブ',
    type: '展示',
    subType: '音楽・ステージ',
    position: { x: 80, y: 65 },
    targetAudience: ['高校生', '大学生'],
    description: '軽音楽部やダンスサークルなどによるライブパフォーマンス',
    detailedDescription: '軽音楽部、ダンスサークル、アカペラサークルなどによる熱いライブパフォーマンスをお楽しみください。ロック、ポップス、ジャズ、クラシックなど様々なジャンルの音楽演奏や、ダンスパフォーマンス、歌唱などを披露します。学生たちの日頃の練習の成果をぜひご覧ください。観客の皆様も一緒に盛り上がりましょう！',
    location: '大講堂ステージ',
    schedule: '13:00-18:00',
    capacity: 300,
    organizer: '軽音楽部・ダンスサークル',
    imageUrl: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['高校生', '大学生', '展示', '音楽・ステージ']
  },
  {
    id: 7,
    name: '開会式',
    type: 'イベント',
    position: { x: 50, y: 20 },
    targetAudience: ['子供向け', '高校生', '大学生'],
    description: '理大祭2024の開会式',
    detailedDescription: '理大祭2024の幕開けを飾る開会式です。学長挨拶、実行委員長挨拶に続き、特別ゲストによる記念講演を予定しています。また、今年の理大祭のハイライトや見どころをご紹介し、皆様に楽しんでいただけるよう準備した企画の数々をお伝えします。理大祭の始まりを一緒にお祝いしましょう！',
    location: '大講堂',
    schedule: '9:00-9:30',
    capacity: 500,
    organizer: '理大祭実行委員会',
    imageUrl: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['子供向け', '高校生', '大学生', 'イベント']
  },
  {
    id: 8,
    name: 'VR体験コーナー',
    type: '展示',
    subType: 'テクノロジー',
    position: { x: 30, y: 80 },
    targetAudience: ['高校生', '大学生'],
    description: '最新のVR技術を体験できます',
    detailedDescription: '最新のVR（仮想現実）技術を実際に体験できるコーナーです。VRゴーグルを装着して、仮想空間での様々な体験をお楽しみいただけます。宇宙遊泳体験、海底探検、古代遺跡の探索など、現実では不可能な体験が可能です。また、VR技術の仕組みや応用分野についても詳しく説明いたします。未来の技術を体感してください！',
    location: '3号館 VR体験室',
    schedule: '10:00-17:00 (15分毎)',
    capacity: 20,
    organizer: 'VR研究会',
    imageUrl: 'https://images.pexels.com/photos/123335/pexels-photo-123335.jpeg?auto=compress&cs=tinysrgb&w=800',
    tags: ['高校生', '大学生', '展示', 'テクノロジー']
  }
];

const MapPage: React.FC<MapPageProps> = ({ onLocationSelect }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAudience, setSelectedAudience] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<ExhibitionItem | null>(null);
  const [isExhibitionModalOpen, setIsExhibitionModalOpen] = useState(false);

  const audienceOptions = ['子供向け', '高校生', '大学生'];
  const typeOptions = ['フード', '展示', 'イベント'];

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  const handleAudienceChange = (audience: string) => {
    setSelectedAudience(prev => 
      prev.includes(audience) 
        ? prev.filter(a => a !== audience)
        : [...prev, audience]
    );
  };

  const handleTypeChange = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const clearAllFilters = () => {
    setSelectedAudience([]);
    setSelectedTypes([]);
  };

  const filteredExhibitions = mockExhibitions.filter(exhibition => {
    const audienceMatch = selectedAudience.length === 0 || 
      selectedAudience.some(audience => exhibition.targetAudience.includes(audience));
    
    const typeMatch = selectedTypes.length === 0 || 
      selectedTypes.includes(exhibition.type);

    return audienceMatch && typeMatch;
  });

  const handleExhibitionClick = (exhibition: ExhibitionItem) => {
    setSelectedExhibition(exhibition);
    setIsExhibitionModalOpen(true);
  };

  const handleCloseExhibitionModal = () => {
    setIsExhibitionModalOpen(false);
    setSelectedExhibition(null);
  };

  const getLocationIcon = (type: string, subType?: string) => {
    if (type === 'フード') return '🍽️';
    if (type === 'イベント') return '🎉';
    if (type === '展示') {
      switch (subType) {
        case '研究室': return '🧪';
        case 'テクノロジー': return '🤖';
        case '科学実験': return '💥';
        case 'アート・文化': return '🎨';
        case '音楽・ステージ': return '🎤';
        default: return '📊';
      }
    }
    return '📍';
  };

  const activeFiltersCount = selectedAudience.length + selectedTypes.length;

  return (
    <div className={styles.mapPage}>
      {/* Filter Header */}
      <div className={styles.filterHeader}>
        <div className={styles.filterContainer}>
          <Button
            variant="outlined"
            startIcon={<FilterList />}
            onClick={handleFilterClick}
            className={styles.filterButton}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              fontWeight: '600',
              borderColor: '#10B981',
              color: '#10B981',
              '&:hover': {
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                borderColor: '#10B981',
              },
            }}
          >
            絞り込み
            {activeFiltersCount > 0 && (
              <Chip
                label={activeFiltersCount}
                size="small"
                sx={{
                  marginLeft: '8px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  height: '20px',
                  fontSize: '0.7rem',
                }}
              />
            )}
          </Button>

          {activeFiltersCount > 0 && (
            <Button
              variant="text"
              startIcon={<Clear />}
              onClick={clearAllFilters}
              className={styles.clearButton}
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                color: '#666',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              クリア
            </Button>
          )}
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className={styles.activeFilters}>
            {selectedAudience.map(audience => (
              <Chip
                key={audience}
                label={audience}
                onDelete={() => handleAudienceChange(audience)}
                size="small"
                className={styles.filterChip}
                sx={{
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  color: '#10B981',
                  '& .MuiChip-deleteIcon': {
                    color: '#10B981',
                  },
                }}
              />
            ))}
            {selectedTypes.map(type => (
              <Chip
                key={type}
                label={type}
                onDelete={() => handleTypeChange(type)}
                size="small"
                className={styles.filterChip}
                sx={{
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  color: '#3B82F6',
                  '& .MuiChip-deleteIcon': {
                    color: '#3B82F6',
                  },
                }}
              />
            ))}
          </div>
        )}

        <div className={styles.resultCount}>
          {filteredExhibitions.length}件の施設が見つかりました
        </div>
      </div>

      {/* Filter Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleFilterClose}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            minWidth: '280px',
            maxHeight: '400px',
          }
        }}
      >
        <div className={styles.filterMenu}>
          <div className={styles.filterSection}>
            <h4 className={styles.filterSectionTitle}>対象</h4>
            {audienceOptions.map(audience => (
              <FormControlLabel
                key={audience}
                control={
                  <Checkbox
                    checked={selectedAudience.includes(audience)}
                    onChange={() => handleAudienceChange(audience)}
                    sx={{
                      color: '#10B981',
                      '&.Mui-checked': {
                        color: '#10B981',
                      },
                    }}
                  />
                }
                label={audience}
                className={styles.filterOption}
              />
            ))}
          </div>

          <Divider sx={{ margin: '12px 0' }} />

          <div className={styles.filterSection}>
            <h4 className={styles.filterSectionTitle}>種類</h4>
            {typeOptions.map(type => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                    sx={{
                      color: '#3B82F6',
                      '&.Mui-checked': {
                        color: '#3B82F6',
                      },
                    }}
                  />
                }
                label={type}
                className={styles.filterOption}
              />
            ))}
          </div>
        </div>
      </Menu>

      {/* Map Container */}
      <div className={styles.mapContainer}>
        <div className={styles.mapBackground}>
          {/* Campus Layout Background */}
          <div className={styles.campusLayout}>
            <div className={styles.building} style={{ top: '20%', left: '15%', width: '25%', height: '30%' }}>
              <span className={styles.buildingLabel}>1号館</span>
            </div>
            <div className={styles.building} style={{ top: '20%', right: '15%', width: '25%', height: '30%' }}>
              <span className={styles.buildingLabel}>2号館</span>
            </div>
            <div className={styles.building} style={{ bottom: '20%', left: '15%', width: '25%', height: '25%' }}>
              <span className={styles.buildingLabel}>3号館</span>
            </div>
            <div className={styles.building} style={{ bottom: '20%', right: '15%', width: '25%', height: '25%' }}>
              <span className={styles.buildingLabel}>中庭</span>
            </div>
          </div>

          {/* Location Pins */}
          {filteredExhibitions.map((exhibition) => (
            <motion.div
              key={exhibition.id}
              className={styles.locationPin}
              style={{
                left: `${exhibition.position.x}%`,
                top: `${exhibition.position.y}%`,
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleExhibitionClick(exhibition)}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: exhibition.id * 0.1 }}
            >
              <div className={styles.pinIcon}>
                <LocationOn className={styles.pinBackground} />
                <span className={styles.pinEmoji}>
                  {getLocationIcon(exhibition.type, exhibition.subType)}
                </span>
              </div>
              <div className={styles.pinLabel}>
                {exhibition.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Exhibition Detail Modal */}
      <ExhibitionModal
        open={isExhibitionModalOpen}
        onClose={handleCloseExhibitionModal}
        exhibition={selectedExhibition}
      />
    </div>
  );
};

export default MapPage;