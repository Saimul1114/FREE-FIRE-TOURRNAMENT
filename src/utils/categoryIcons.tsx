import React from 'react';
import {
  PawPrint, Film, ShieldAlert, Palette, KeyRound, Coins, BookOpen,
  Briefcase, Calendar, Cloud, GitBranch, DollarSign, CheckCircle2,
  Code2, BookMarked, FileText, Mail, Tv, Trees, CalendarDays,
  Landmark, Utensils, Gamepad2, MapPin, Building2, HeartPulse,
  Cpu, Music, Newspaper, Database, FolderGit2,
  Smile, Phone, Camera, Binary, FlaskConical, ShieldCheck,
  ShoppingBag, Users, Activity, TestTube2, FileSearch, Navigation,
  Truck, Link2, Car, Video, CloudSun, Globe, HelpCircle
} from 'lucide-react';

export function getCategoryIcon(category: string, className = "w-4 h-4") {
  const norm = category.toLowerCase();

  if (norm.includes('animal')) return <PawPrint className={className} />;
  if (norm.includes('anime')) return <Film className={className} />;
  if (norm.includes('anti-malware')) return <ShieldAlert className={className} />;
  if (norm.includes('art')) return <Palette className={className} />;
  if (norm.includes('auth')) return <KeyRound className={className} />;
  if (norm.includes('blockchain') || norm.includes('crypto')) return <Coins className={className} />;
  if (norm.includes('book') || norm.includes('dictionary')) return <BookOpen className={className} />;
  if (norm.includes('business')) return <Briefcase className={className} />;
  if (norm.includes('calendar') || norm.includes('event')) return <Calendar className={className} />;
  if (norm.includes('cloud')) return <Cloud className={className} />;
  if (norm.includes('continuous')) return <GitBranch className={className} />;
  if (norm.includes('currency') || norm.includes('finance')) return <DollarSign className={className} />;
  if (norm.includes('validation')) return <CheckCircle2 className={className} />;
  if (norm.includes('dev') || norm.includes('programming')) return <Code2 className={className} />;
  if (norm.includes('document')) return <FileText className={className} />;
  if (norm.includes('email')) return <Mail className={className} />;
  if (norm.includes('entertainment')) return <Tv className={className} />;
  if (norm.includes('environment')) return <Trees className={className} />;
  if (norm.includes('food')) return <Utensils className={className} />;
  if (norm.includes('game') || norm.includes('comic')) return <Gamepad2 className={className} />;
  if (norm.includes('geocoding') || norm.includes('track') || norm.includes('map')) return <MapPin className={className} />;
  if (norm.includes('government')) return <Building2 className={className} />;
  if (norm.includes('health') || norm.includes('sport') || norm.includes('fitness')) return <HeartPulse className={className} />;
  if (norm.includes('job')) return <Briefcase className={className} />;
  if (norm.includes('machine') || norm.includes('learning') || norm.includes('ai')) return <Cpu className={className} />;
  if (norm.includes('music')) return <Music className={className} />;
  if (norm.includes('news')) return <Newspaper className={className} />;
  if (norm.includes('data')) return <Database className={className} />;
  if (norm.includes('open source')) return <FolderGit2 className={className} />;
  if (norm.includes('personality')) return <Smile className={className} />;
  if (norm.includes('phone')) return <Phone className={className} />;
  if (norm.includes('photo')) return <Camera className={className} />;
  if (norm.includes('science') || norm.includes('math')) return <FlaskConical className={className} />;
  if (norm.includes('security')) return <ShieldCheck className={className} />;
  if (norm.includes('shop')) return <ShoppingBag className={className} />;
  if (norm.includes('social')) return <Users className={className} />;
  if (norm.includes('test')) return <TestTube2 className={className} />;
  if (norm.includes('text')) return <FileSearch className={className} />;
  if (norm.includes('transport') || norm.includes('vehicle')) return <Car className={className} />;
  if (norm.includes('url')) return <Link2 className={className} />;
  if (norm.includes('video')) return <Video className={className} />;
  if (norm.includes('weather')) return <CloudSun className={className} />;

  return <Globe className={className} />;
}
