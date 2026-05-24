import Hero from '../components/Hero.jsx';
import SkillsScroll from '../components/SkillsScroll.jsx';
import CountrySilhouettes from '../components/CountrySilhouettes.jsx';
import FriendQuotes from '../components/FriendQuotes.jsx';
import GameCTA from '../components/GameCTA.jsx';

export default function TributePage() {
  return (
    <main>
      <Hero />
      <SkillsScroll />
      <CountrySilhouettes />
      <FriendQuotes />
      <GameCTA />
    </main>
  );
}
