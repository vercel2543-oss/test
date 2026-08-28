import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AwardProvider, useAwards } from './context/AwardContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/public/HeroSection';
import { FeaturedAwards } from './components/public/FeaturedAwards';
import { HallOfFame } from './components/public/HallOfFame';
import { PublicGallery } from './components/public/PublicGallery';
import { TimelineView } from './components/public/TimelineView';
import { StatsView } from './components/public/StatsView';
import { AwardDetailModal } from './components/public/AwardDetailModal';
import { SocialShareModal } from './components/public/SocialShareModal';
import { QRCodeModal } from './components/public/QRCodeModal';
import { ShareImageCardModal } from './components/public/ShareImageCardModal';
import { RecipientPortfolioModal } from './components/public/RecipientPortfolioModal';
import { LoginModal } from './components/public/LoginModal';
import { AdminLayout } from './components/admin/AdminLayout';
import { AwardCard } from './components/public/AwardCard';
import { Award } from './types';
import { ArrowRight, Trophy, Sparkles, Award as AwardIcon } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeView, setActiveView, awards, selectedRecipientName, setSelectedRecipientName } = useAwards();
  const { currentUser, isSuperAdmin } = useAuth();

  // Modal States
  const [selectedAwardForDetail, setSelectedAwardForDetail] = useState<Award | null>(null);
  const [selectedAwardForShare, setSelectedAwardForShare] = useState<Award | null>(null);
  const [selectedAwardForQR, setSelectedAwardForQR] = useState<Award | null>(null);
  const [selectedAwardForImage, setSelectedAwardForImage] = useState<Award | null>(null);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  // If activeView is 'admin', render AdminLayout directly
  if (activeView === 'admin') {
    if (!currentUser) {
      // Prompt login if not logged in
      return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Trophy size={28} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">กรุณาเข้าสู่ระบบจัดการ</h2>
            <p className="text-xs text-slate-500">
              หน้านี้สำหรับผู้ดูแลระบบส่วนกลางและผู้ดูแลประจำฝ่ายทั้ง 5 ฝ่าย
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
              >
                เข้าสู่ระบบ (Sign In)
              </button>
              <button
                onClick={() => setActiveView('home')}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800"
              >
                กลับสู่หน้าหลักสาธารณะ
              </button>
            </div>
          </div>
          <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
        </div>
      );
    }
    return (
      <>
        <AdminLayout
          onOpenDetail={award => setSelectedAwardForDetail(award)}
        />
        {/* Modals available in Admin if triggered */}
        <AwardDetailModal
          award={selectedAwardForDetail}
          onClose={() => setSelectedAwardForDetail(null)}
          onOpenShare={award => setSelectedAwardForShare(award)}
          onOpenQR={award => setSelectedAwardForQR(award)}
          onOpenShareImage={award => setSelectedAwardForImage(award)}
        />
      </>
    );
  }

  const publishedAwards = awards.filter(a => !a.deleted && a.status === 'published');
  const recentAwards = publishedAwards.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Global Public Header */}
      <Header onOpenLogin={() => setShowLoginModal(true)} />

      {/* Main Public Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
        {/* VIEW 1: HOME */}
        {(activeView === 'home' || activeView === 'public_home') && (
          <div className="space-y-12">
            {/* Hero Section */}
            <HeroSection />

            {/* Featured Awards Section */}
            <FeaturedAwards
              onOpenDetail={award => setSelectedAwardForDetail(award)}
              onOpenShare={award => setSelectedAwardForShare(award)}
              onOpenQR={award => setSelectedAwardForQR(award)}
              onOpenShareImage={award => setSelectedAwardForImage(award)}
            />

            {/* Hall of Fame Gold/Silver Showcase Section */}
            <HallOfFame
              onOpenDetail={award => setSelectedAwardForDetail(award)}
              onOpenShare={award => setSelectedAwardForShare(award)}
              onOpenQR={award => setSelectedAwardForQR(award)}
              onOpenShareImage={award => setSelectedAwardForImage(award)}
            />

            {/* Recent Awards Section */}
            <section className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <AwardIcon size={20} className="text-blue-600" />
                    <span>ผลงานและรางวัลล่าสุด (Recent Achievements)</span>
                  </h2>
                  <p className="text-xs text-slate-500">ผลงานที่ได้รับการบันทึกและเผยแพร่ล่าสุดจาก 5 ฝ่าย</p>
                </div>

                <button
                  onClick={() => setActiveView('public_gallery')}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
                >
                  <span>ดูคลังผลงานทั้งหมด ({publishedAwards.length})</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentAwards.map(award => (
                  <AwardCard
                    key={award.id}
                    award={award}
                    onOpenDetail={award => setSelectedAwardForDetail(award)}
                    onOpenShare={award => setSelectedAwardForShare(award)}
                    onOpenQR={award => setSelectedAwardForQR(award)}
                    onOpenShareImage={award => setSelectedAwardForImage(award)}
                  />
                ))}
              </div>
            </section>
          </div>
        )}

        {/* VIEW 2: PUBLIC GALLERY */}
        {(activeView === 'public_gallery' || activeView === 'gallery') && (
          <PublicGallery
            onOpenDetail={award => setSelectedAwardForDetail(award)}
            onOpenShare={award => setSelectedAwardForShare(award)}
            onOpenQR={award => setSelectedAwardForQR(award)}
            onOpenShareImage={award => setSelectedAwardForImage(award)}
          />
        )}

        {/* VIEW 3: HALL OF FAME FULL */}
        {(activeView === 'hall_of_fame' || activeView === 'public_hall_of_fame') && (
          <div className="space-y-8 py-4">
            <HallOfFame
              onOpenDetail={award => setSelectedAwardForDetail(award)}
              onOpenShare={award => setSelectedAwardForShare(award)}
              onOpenQR={award => setSelectedAwardForQR(award)}
              onOpenShareImage={award => setSelectedAwardForImage(award)}
            />
          </div>
        )}

        {/* VIEW 4: TIMELINE */}
        {(activeView === 'timeline' || activeView === 'public_timeline') && (
          <TimelineView
            onOpenDetail={award => setSelectedAwardForDetail(award)}
            onOpenShare={award => setSelectedAwardForShare(award)}
            onOpenQR={award => setSelectedAwardForQR(award)}
            onOpenShareImage={award => setSelectedAwardForImage(award)}
          />
        )}

        {/* VIEW 5: STATS */}
        {(activeView === 'stats' || activeView === 'public_stats') && <StatsView />}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Modals */}
      <AwardDetailModal
        award={selectedAwardForDetail}
        onClose={() => setSelectedAwardForDetail(null)}
        onOpenShare={award => setSelectedAwardForShare(award)}
        onOpenQR={award => setSelectedAwardForQR(award)}
        onOpenShareImage={award => setSelectedAwardForImage(award)}
      />

      <SocialShareModal
        award={selectedAwardForShare}
        onClose={() => setSelectedAwardForShare(null)}
        onOpenQR={award => setSelectedAwardForQR(award)}
        onOpenShareImage={award => setSelectedAwardForImage(award)}
      />

      <QRCodeModal
        award={selectedAwardForQR}
        onClose={() => setSelectedAwardForQR(null)}
      />

      <ShareImageCardModal
        award={selectedAwardForImage}
        onClose={() => setSelectedAwardForImage(null)}
      />

      <RecipientPortfolioModal
        recipientName={selectedRecipientName}
        onClose={() => setSelectedRecipientName(null)}
        onOpenAwardDetail={award => setSelectedAwardForDetail(award)}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AwardProvider>
        <MainAppContent />
      </AwardProvider>
    </AuthProvider>
  );
}
