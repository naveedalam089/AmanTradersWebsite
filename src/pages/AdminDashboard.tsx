import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, LogOut, Trash2, Star, User, Calendar, 
  AlertTriangle, CheckCircle, MessageSquare, Mail, Package,
  Settings, Eye, EyeOff, Plus, Edit, Save, X, Users, 
  FolderOpen, Building2, MapPin, Phone, Clock, Globe, Upload, Link, Award, Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Review {
  id: string; name: string; email: string; rating: number; review: string; created_at: string;
}
interface ContactMessage {
  id: string; name: string; email: string; phone: string | null; subject: string; message: string; is_read: boolean; created_at: string;
}
interface Product {
  id: string; category: string; name: string; description: string | null; is_available: boolean; sort_order: number;
}
interface ProductCategory {
  id: string; name: string; description: string | null; icon_name: string; icon_bg: string; gradient: string; sort_order: number;
}
interface TeamMember {
  id: string; name: string; role: string; description: string | null; image_url: string | null; sort_order: number;
}
interface Brand {
  id: string; name: string; description: string | null; logo_url: string | null; website_url: string | null; sort_order: number;
}
interface SiteSetting {
  id: string; setting_key: string; setting_value: string;
}
interface LicenseCert {
  id: string; title: string; description: string | null; image_url: string | null; sort_order: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("messages");
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [licenses, setLicenses] = useState<LicenseCert[]>([]);
  
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ category: "", name: "", description: "" });
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryId, setProductCategoryId] = useState<string>("all");
  
  const [editingCategory, setEditingCategory] = useState<ProductCategory | null>(null);
  const [newCategory, setNewCategory] = useState({ name: "", description: "", icon_name: "Package" });
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [newMember, setNewMember] = useState({ name: "", role: "", description: "" });
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberImageFile, setMemberImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [newBrand, setNewBrand] = useState({ name: "", description: "", website_url: "" });
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [brandLogoFile, setBrandLogoFile] = useState<File | null>(null);
  
  const [contactSettings, setContactSettings] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  
  const [passwordData, setPasswordData] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // License states
  const [editingLicense, setEditingLicense] = useState<LicenseCert | null>(null);
  const [newLicense, setNewLicense] = useState({ title: "", description: "" });
  const [showAddLicense, setShowAddLicense] = useState(false);
  const [licenseImageFile, setLicenseImageFile] = useState<File | null>(null);

  // Social links states
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});
  const [savingSocial, setSavingSocial] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const brandFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const [siteLogoFile, setSiteLogoFile] = useState<File | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string | null>(null);

  useEffect(() => { checkAdminAndFetch(); }, []);

  const checkAdminAndFetch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate('/admin-login'); return; }
      const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
      if (!roleData) { await supabase.auth.signOut(); navigate('/admin-login'); toast({ title: "Access Denied", description: "Admin privileges required.", variant: "destructive" }); return; }
      setIsAdmin(true);
      await Promise.all([fetchReviews(), fetchMessages(), fetchProducts(), fetchCategories(), fetchTeamMembers(), fetchBrands(), fetchSiteSettings(), fetchLicenses()]);
    } catch (error) { console.error('Auth check error:', error); navigate('/admin-login'); }
    finally { setIsLoading(false); }
  };

  const fetchReviews = async () => { const { data } = await supabase.from('reviews').select('*').order('created_at', { ascending: false }); setReviews(data || []); };
  const fetchMessages = async () => { const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }); setMessages(data || []); };
  const fetchProducts = async () => { const { data } = await supabase.from('products').select('*').order('category').order('sort_order'); setProducts(data || []); };
  const fetchCategories = async () => { const { data } = await supabase.from('product_categories').select('*').order('sort_order'); setCategories(data || []); };
  const fetchTeamMembers = async () => { const { data } = await supabase.from('team_members').select('*').order('sort_order'); setTeamMembers(data || []); };
  const fetchBrands = async () => { const { data } = await supabase.from('brands').select('*').order('sort_order'); setBrands(data || []); };
  const fetchLicenses = async () => { const { data } = await supabase.from('licenses_certifications').select('*').order('sort_order'); setLicenses(data || []); };
  const fetchSiteSettings = async () => {
    const { data } = await supabase.from('site_settings').select('*');
    setSiteSettings(data || []);
    const settingsMap: Record<string, string> = {};
    (data || []).forEach(s => { settingsMap[s.setting_key] = s.setting_value; });
    setContactSettings(settingsMap);
    // Extract social links
    const socials: Record<string, string> = {};
    const socialKeys = ['social_facebook', 'social_instagram', 'social_linkedin', 'social_twitter', 'social_youtube', 'social_tiktok', 'social_whatsapp'];
    socialKeys.forEach(k => { socials[k] = settingsMap[k] || ''; });
    setSocialLinks(socials);
    if (settingsMap['site_logo_url']) setCurrentLogoUrl(settingsMap['site_logo_url']);
  };

  // Review handlers
  const handleDeleteReview = async (reviewId: string) => {
    setDeletingId(reviewId);
    try { const { error } = await supabase.from('reviews').delete().eq('id', reviewId); if (error) throw error; setReviews(reviews.filter(r => r.id !== reviewId)); toast({ title: "Review Deleted" }); }
    catch (error: any) { toast({ title: "Delete Failed", description: error.message, variant: "destructive" }); }
    finally { setDeletingId(null); }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setDeletingId(messageId);
    try { const { error } = await supabase.from('contact_messages').delete().eq('id', messageId); if (error) throw error; setMessages(messages.filter(m => m.id !== messageId)); setSelectedMessage(null); toast({ title: "Message Deleted" }); }
    catch (error: any) { toast({ title: "Delete Failed", description: error.message, variant: "destructive" }); }
    finally { setDeletingId(null); }
  };

  const markMessageAsRead = async (message: ContactMessage) => {
    if (message.is_read) return;
    await supabase.from('contact_messages').update({ is_read: true }).eq('id', message.id);
    setMessages(messages.map(m => m.id === message.id ? { ...m, is_read: true } : m));
  };

  // Product handlers
  const handleAddProduct = async () => {
    if (!newProduct.category || !newProduct.name) { toast({ title: "Required Fields", description: "Category and name are required.", variant: "destructive" }); return; }
    try { const { error } = await supabase.from('products').insert([{ category: newProduct.category, name: newProduct.name, description: newProduct.description || null }]); if (error) throw error; await fetchProducts(); setNewProduct({ category: "", name: "", description: "" }); setShowAddProduct(false); toast({ title: "Product Added" }); }
    catch (error: any) { toast({ title: "Add Failed", description: error.message, variant: "destructive" }); }
  };
  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try { const { error } = await supabase.from('products').update({ name: editingProduct.name, description: editingProduct.description, is_available: editingProduct.is_available }).eq('id', editingProduct.id); if (error) throw error; await fetchProducts(); setEditingProduct(null); toast({ title: "Product Updated" }); }
    catch (error: any) { toast({ title: "Update Failed", description: error.message, variant: "destructive" }); }
  };
  const handleDeleteProduct = async (productId: string) => {
    try { const { error } = await supabase.from('products').delete().eq('id', productId); if (error) throw error; await fetchProducts(); toast({ title: "Product Deleted" }); }
    catch (error: any) { toast({ title: "Delete Failed", description: error.message, variant: "destructive" }); }
  };

  // Category handlers
  const handleAddCategory = async () => {
    if (!newCategory.name) { toast({ title: "Required", description: "Category name is required.", variant: "destructive" }); return; }
    try { const { error } = await supabase.from('product_categories').insert([{ name: newCategory.name, description: newCategory.description || null, icon_name: newCategory.icon_name || 'Package', sort_order: categories.length }]); if (error) throw error; await fetchCategories(); setNewCategory({ name: "", description: "", icon_name: "Package" }); setShowAddCategory(false); toast({ title: "Category Added" }); }
    catch (error: any) { toast({ title: "Add Failed", description: error.message, variant: "destructive" }); }
  };
  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    try { const { error } = await supabase.from('product_categories').update({ name: editingCategory.name, description: editingCategory.description, icon_name: editingCategory.icon_name }).eq('id', editingCategory.id); if (error) throw error; await fetchCategories(); setEditingCategory(null); toast({ title: "Category Updated" }); }
    catch (error: any) { toast({ title: "Update Failed", description: error.message, variant: "destructive" }); }
  };
  const handleDeleteCategory = async (categoryId: string) => {
    try { const { error } = await supabase.from('product_categories').delete().eq('id', categoryId); if (error) throw error; await fetchCategories(); toast({ title: "Category Deleted" }); }
    catch (error: any) { toast({ title: "Delete Failed", description: error.message, variant: "destructive" }); }
  };

  // Team member handlers
  const uploadTeamImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('team-images').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('team-images').getPublicUrl(fileName);
    return data.publicUrl;
  };
  const handleAddMember = async () => {
    if (!newMember.name || !newMember.role) { toast({ title: "Required", description: "Name and role are required.", variant: "destructive" }); return; }
    setUploadingImage(true);
    try {
      let imageUrl = null;
      if (memberImageFile) { imageUrl = await uploadTeamImage(memberImageFile); }
      const { error } = await supabase.from('team_members').insert([{ name: newMember.name, role: newMember.role, description: newMember.description || null, image_url: imageUrl, sort_order: teamMembers.length }]);
      if (error) throw error;
      await fetchTeamMembers(); setNewMember({ name: "", role: "", description: "" }); setMemberImageFile(null); setShowAddMember(false); toast({ title: "Team Member Added" });
    } catch (error: any) { toast({ title: "Add Failed", description: error.message, variant: "destructive" }); }
    finally { setUploadingImage(false); }
  };
  const handleUpdateMember = async () => {
    if (!editingMember) return;
    setUploadingImage(true);
    try {
      let imageUrl = editingMember.image_url;
      if (memberImageFile) { imageUrl = await uploadTeamImage(memberImageFile); }
      const { error } = await supabase.from('team_members').update({ name: editingMember.name, role: editingMember.role, description: editingMember.description, image_url: imageUrl }).eq('id', editingMember.id);
      if (error) throw error;
      await fetchTeamMembers(); setEditingMember(null); setMemberImageFile(null); toast({ title: "Team Member Updated" });
    } catch (error: any) { toast({ title: "Update Failed", description: error.message, variant: "destructive" }); }
    finally { setUploadingImage(false); }
  };
  const handleDeleteMember = async (memberId: string) => {
    try { const { error } = await supabase.from('team_members').delete().eq('id', memberId); if (error) throw error; await fetchTeamMembers(); toast({ title: "Team Member Deleted" }); }
    catch (error: any) { toast({ title: "Delete Failed", description: error.message, variant: "destructive" }); }
  };

  // Brand handlers
  const uploadBrandLogo = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('brand-logos').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('brand-logos').getPublicUrl(fileName);
    return data.publicUrl;
  };
  const handleAddBrand = async () => {
    if (!newBrand.name) { toast({ title: "Required", description: "Brand name is required.", variant: "destructive" }); return; }
    setUploadingImage(true);
    try {
      let logoUrl = null;
      if (brandLogoFile) { logoUrl = await uploadBrandLogo(brandLogoFile); }
      const { error } = await supabase.from('brands').insert([{ name: newBrand.name, description: newBrand.description || null, website_url: newBrand.website_url || null, logo_url: logoUrl, sort_order: brands.length }]);
      if (error) throw error;
      await fetchBrands(); setNewBrand({ name: "", description: "", website_url: "" }); setBrandLogoFile(null); setShowAddBrand(false); toast({ title: "Brand Added" });
    } catch (error: any) { toast({ title: "Add Failed", description: error.message, variant: "destructive" }); }
    finally { setUploadingImage(false); }
  };
  const handleUpdateBrand = async () => {
    if (!editingBrand) return;
    setUploadingImage(true);
    try {
      let logoUrl = editingBrand.logo_url;
      if (brandLogoFile) { logoUrl = await uploadBrandLogo(brandLogoFile); }
      const { error } = await supabase.from('brands').update({ name: editingBrand.name, description: editingBrand.description, website_url: editingBrand.website_url, logo_url: logoUrl }).eq('id', editingBrand.id);
      if (error) throw error;
      await fetchBrands(); setEditingBrand(null); setBrandLogoFile(null); toast({ title: "Brand Updated" });
    } catch (error: any) { toast({ title: "Update Failed", description: error.message, variant: "destructive" }); }
    finally { setUploadingImage(false); }
  };
  const handleDeleteBrand = async (brandId: string) => {
    try { const { error } = await supabase.from('brands').delete().eq('id', brandId); if (error) throw error; await fetchBrands(); toast({ title: "Brand Deleted" }); }
    catch (error: any) { toast({ title: "Delete Failed", description: error.message, variant: "destructive" }); }
  };

  // License handlers
  const uploadLicenseImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { error } = await supabase.storage.from('license-images').upload(fileName, file);
    if (error) throw error;
    const { data } = supabase.storage.from('license-images').getPublicUrl(fileName);
    return data.publicUrl;
  };
  const handleAddLicense = async () => {
    if (!newLicense.title) { toast({ title: "Required", description: "Title is required.", variant: "destructive" }); return; }
    setUploadingImage(true);
    try {
      let imageUrl = null;
      if (licenseImageFile) { imageUrl = await uploadLicenseImage(licenseImageFile); }
      const { error } = await supabase.from('licenses_certifications').insert([{ title: newLicense.title, description: newLicense.description || null, image_url: imageUrl, sort_order: licenses.length }]);
      if (error) throw error;
      await fetchLicenses(); setNewLicense({ title: "", description: "" }); setLicenseImageFile(null); setShowAddLicense(false); toast({ title: "License/Certificate Added" });
    } catch (error: any) { toast({ title: "Add Failed", description: error.message, variant: "destructive" }); }
    finally { setUploadingImage(false); }
  };
  const handleUpdateLicense = async () => {
    if (!editingLicense) return;
    setUploadingImage(true);
    try {
      let imageUrl = editingLicense.image_url;
      if (licenseImageFile) { imageUrl = await uploadLicenseImage(licenseImageFile); }
      const { error } = await supabase.from('licenses_certifications').update({ title: editingLicense.title, description: editingLicense.description, image_url: imageUrl }).eq('id', editingLicense.id);
      if (error) throw error;
      await fetchLicenses(); setEditingLicense(null); setLicenseImageFile(null); toast({ title: "License/Certificate Updated" });
    } catch (error: any) { toast({ title: "Update Failed", description: error.message, variant: "destructive" }); }
    finally { setUploadingImage(false); }
  };
  const handleDeleteLicense = async (licenseId: string) => {
    try { const { error } = await supabase.from('licenses_certifications').delete().eq('id', licenseId); if (error) throw error; await fetchLicenses(); toast({ title: "License/Certificate Deleted" }); }
    catch (error: any) { toast({ title: "Delete Failed", description: error.message, variant: "destructive" }); }
  };

  // Contact settings handlers
  const handleSaveContactSettings = async () => {
    setSavingSettings(true);
    try {
      for (const [key, value] of Object.entries(contactSettings)) {
        const { error } = await supabase.from('site_settings').upsert({ setting_key: key, setting_value: value }, { onConflict: 'setting_key' });
        if (error) throw error;
      }
      await fetchSiteSettings(); toast({ title: "Contact Settings Saved" });
    } catch (error: any) { toast({ title: "Save Failed", description: error.message, variant: "destructive" }); }
    finally { setSavingSettings(false); }
  };

  // Social links handler
  const handleSaveSocialLinks = async () => {
    setSavingSocial(true);
    try {
      for (const [key, value] of Object.entries(socialLinks)) {
        if (value) {
          const { error } = await supabase.from('site_settings').upsert({ setting_key: key, setting_value: value }, { onConflict: 'setting_key' });
          if (error) throw error;
        } else {
          // Delete empty social links
          await supabase.from('site_settings').delete().eq('setting_key', key);
        }
      }
      await fetchSiteSettings(); toast({ title: "Social Links Saved" });
    } catch (error: any) { toast({ title: "Save Failed", description: error.message, variant: "destructive" }); }
    finally { setSavingSocial(false); }
  };

  // Password handler - updates password via Supabase auth
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast({ title: "Password Mismatch", description: "New passwords don't match.", variant: "destructive" }); return; }
    if (passwordData.newPassword.length < 6) { toast({ title: "Weak Password", description: "Password must be at least 6 characters.", variant: "destructive" }); return; }
    setIsChangingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: passwordData.newPassword });
      if (error) throw error;
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({ title: "Password Changed", description: "Your password has been updated successfully." });
    } catch (error: any) { toast({ title: "Update Failed", description: error.message, variant: "destructive" }); }
    finally { setIsChangingPassword(false); }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); navigate('/admin-login'); };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (!isAdmin || isLoading) {
    return (<div className="min-h-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" /></div>);
  }

  const unreadCount = messages.filter(m => !m.is_read).length;
  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0";

  const normalize = (value: string) => value.toLowerCase().trim();
  const productSearchQ = normalize(productSearch);
  const categorySearchQ = normalize(categorySearch);

  const productsByCategory = categories.map((cat) => ({ ...cat, products: products.filter((p) => p.category === cat.name) }));
  const filteredProductsByCategory = productsByCategory
    .filter((cat) => productCategoryId === "all" || cat.id === productCategoryId)
    .flatMap((cat) => {
      if (!productSearchQ) return [cat];
      const categoryMatches = normalize(cat.name).includes(productSearchQ);
      const filteredProducts = categoryMatches ? cat.products : cat.products.filter((p) => normalize(p.name).includes(productSearchQ) || normalize(p.description ?? "").includes(productSearchQ));
      if (!categoryMatches && filteredProducts.length === 0) return [];
      return [{ ...cat, products: filteredProducts }];
    });
  const filteredCategories = categories.filter((cat) => {
    if (!categorySearchQ) return true;
    return normalize(cat.name).includes(categorySearchQ) || normalize(cat.description ?? "").includes(categorySearchQ) || normalize(cat.icon_name ?? "").includes(categorySearchQ);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center"><Shield className="w-5 h-5 text-primary" /></div>
            <div><h1 className="font-bold text-foreground">Admin Dashboard</h1><p className="text-xs text-muted-foreground">Aman Traders Management</p></div>
          </div>
          <Button variant="outline" onClick={handleLogout}><LogOut className="w-4 h-4 mr-2" />Logout</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card/80 border-border"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center"><Mail className="w-5 h-5 text-blue-500" /></div><div><p className="text-xl font-bold text-foreground">{messages.length}</p><p className="text-xs text-muted-foreground">Messages {unreadCount > 0 && <Badge variant="destructive" className="ml-1">{unreadCount}</Badge>}</p></div></CardContent></Card>
          <Card className="bg-card/80 border-border"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center"><Star className="w-5 h-5 text-yellow-500" /></div><div><p className="text-xl font-bold text-foreground">{averageRating}</p><p className="text-xs text-muted-foreground">Avg Rating</p></div></CardContent></Card>
          <Card className="bg-card/80 border-border"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center"><Package className="w-5 h-5 text-green-500" /></div><div><p className="text-xl font-bold text-foreground">{products.length}</p><p className="text-xs text-muted-foreground">Products</p></div></CardContent></Card>
          <Card className="bg-card/80 border-border"><CardContent className="p-4 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center"><Building2 className="w-5 h-5 text-purple-500" /></div><div><p className="text-xl font-bold text-foreground">{brands.length}</p><p className="text-xs text-muted-foreground">Brands</p></div></CardContent></Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="inline-flex w-auto min-w-full lg:grid lg:grid-cols-10 h-auto gap-1">
              <TabsTrigger value="messages" className="flex items-center gap-1.5 text-xs px-3 py-2 whitespace-nowrap"><Mail className="w-4 h-4 flex-shrink-0" />Messages{unreadCount > 0 && <Badge variant="destructive" className="h-5 px-1">{unreadCount}</Badge>}</TabsTrigger>
              <TabsTrigger value="reviews" className="flex items-center gap-1.5 text-xs px-3 py-2 whitespace-nowrap"><MessageSquare className="w-4 h-4 flex-shrink-0" />Reviews</TabsTrigger>
              <TabsTrigger value="products" className="flex items-center gap-1.5 text-xs px-3 py-2 whitespace-nowrap"><Package className="w-4 h-4 flex-shrink-0" />Products</TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-1.5 text-xs px-3 py-2 whitespace-nowrap"><FolderOpen className="w-4 h-4 flex-shrink-0" />Categories</TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-1.5 text-xs px-3 py-2 whitespace-nowrap"><Users className="w-4 h-4 flex-shrink-0" />Team</TabsTrigger>
              <TabsTrigger value="licenses" className="flex items-center gap-1.5 text-xs px-3 py-2 whitespace-nowrap"><Award className="w-4 h-4 flex-shrink-0" />Licenses</TabsTrigger>
              <TabsTrigger value="brands" className="flex items-center gap-1.5 text-xs px-3 py-2 whitespace-nowrap"><Building2 className="w-4 h-4 flex-shrink-0" />Brands</TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-1.5 text-xs px-3 py-2 whitespace-nowrap"><Share2 className="w-4 h-4 flex-shrink-0" />Social</TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-1.5 text-xs px-3 py-2 whitespace-nowrap"><MapPin className="w-4 h-4 flex-shrink-0" />Contact</TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-1.5 text-xs px-3 py-2 whitespace-nowrap"><Settings className="w-4 h-4 flex-shrink-0" />Settings</TabsTrigger>
            </TabsList>
          </div>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card className="bg-card/80 border-border">
              <CardHeader><CardTitle className="flex items-center gap-2"><Mail className="w-5 h-5 text-blue-500" />Contact Messages</CardTitle></CardHeader>
              <CardContent>
                {messages.length === 0 ? (
                  <div className="text-center py-12"><Mail className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">No messages yet</p></div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div key={msg.id} onClick={() => { setSelectedMessage(msg); markMessageAsRead(msg); }}
                        className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/30 ${!msg.is_read ? 'bg-primary/5 border-primary/20' : 'bg-background/50 border-border'}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-foreground">{msg.name}</span>
                              {!msg.is_read && <Badge variant="default" className="text-xs">New</Badge>}
                            </div>
                            <p className="text-sm font-medium text-foreground/80 mt-1">{msg.subject}</p>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{msg.message}</p>
                            <p className="text-xs text-muted-foreground mt-2">{formatDate(msg.created_at)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <Card className="bg-card/80 border-border">
              <CardHeader><CardTitle className="flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-yellow-500" />Review Moderation</CardTitle></CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-12"><MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">No reviews to moderate</p></div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0"><User className="w-5 h-5 text-primary" /></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-foreground">{review.name}</span>
                                <span className="text-xs text-muted-foreground">{review.email}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex gap-0.5">{[1,2,3,4,5].map((star) => (<Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />))}</div>
                                <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(review.created_at)}</span>
                              </div>
                              <p className="mt-2 text-muted-foreground text-sm">{review.review}</p>
                            </div>
                          </div>
                          <AlertDialog>
                            <AlertDialogTrigger asChild><Button variant="destructive" size="sm" disabled={deletingId === review.id}>{deletingId === review.id ? <span className="w-4 h-4 border-2 border-destructive-foreground/30 border-t-destructive-foreground rounded-full animate-spin" /> : <Trash2 className="w-4 h-4" />}</Button></AlertDialogTrigger>
                            <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Review?</AlertDialogTitle><AlertDialogDescription>This will permanently delete the review by <strong>{review.name}</strong>.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteReview(review.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card className="bg-card/80 border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Package className="w-5 h-5 text-green-500" />Product Management</CardTitle>
                <Button onClick={() => setShowAddProduct(true)} size="sm"><Plus className="w-4 h-4 mr-2" />Add Product</Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-3 mb-6">
                  <div className="flex-1"><Input value={productSearch} onChange={(e) => setProductSearch(e.target.value)} placeholder="Search product or category..." /></div>
                  <div className="w-full lg:w-72">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" value={productCategoryId} onChange={(e) => { const next = e.target.value; setProductCategoryId(next); if (next !== "all") { requestAnimationFrame(() => { document.getElementById(`admin-products-cat-${next}`)?.scrollIntoView({ behavior: "smooth", block: "start" }); }); } }}>
                      <option value="all">All categories</option>
                      {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
                    </select>
                  </div>
                </div>
                <div className="space-y-6">
                  {filteredProductsByCategory.map((cat) => (
                    <div key={cat.id} id={`admin-products-cat-${cat.id}`} className="space-y-3">
                      <h3 className="font-semibold text-foreground border-b border-border pb-2">{cat.name}</h3>
                      <div className="grid gap-2">
                        {cat.products.map((product) => (
                          <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                            <div className="flex items-center gap-3">
                              <span className={`text-foreground ${!product.is_available ? 'line-through opacity-50' : ''}`}>{product.name}</span>
                              {!product.is_available && <Badge variant="secondary">Unavailable</Badge>}
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setEditingProduct(product)}><Edit className="w-4 h-4" /></Button>
                              <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Product?</AlertDialogTitle><AlertDialogDescription>This will remove "{product.name}" from your catalog.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                            </div>
                          </div>
                        ))}
                        {cat.products.length === 0 && <p className="text-sm text-muted-foreground italic">No products in this category</p>}
                      </div>
                    </div>
                  ))}
                  {filteredProductsByCategory.length === 0 && <div className="text-center py-12"><Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">No matching products</p></div>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories">
            <Card className="bg-card/80 border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><FolderOpen className="w-5 h-5 text-orange-500" />Category Management</CardTitle>
                <Button onClick={() => setShowAddCategory(true)} size="sm"><Plus className="w-4 h-4 mr-2" />Add Category</Button>
              </CardHeader>
              <CardContent>
                <div className="mb-4"><Input value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} placeholder="Search categories..." /></div>
                {categories.length === 0 ? (
                  <div className="text-center py-12"><FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">No categories yet</p></div>
                ) : filteredCategories.length === 0 ? (
                  <div className="text-center py-12"><FolderOpen className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">No matching categories</p></div>
                ) : (
                  <div className="grid gap-4">
                    {filteredCategories.map((cat) => (
                      <div key={cat.id} className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors">
                        <div>
                          <h4 className="font-semibold text-foreground">{cat.name}</h4>
                          {cat.description && <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>}
                          <p className="text-xs text-muted-foreground mt-1">Icon: {cat.icon_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={() => setEditingCategory(cat)}><Edit className="w-4 h-4" /></Button>
                          <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Category?</AlertDialogTitle><AlertDialogDescription>This will remove "{cat.name}" category.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCategory(cat.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team">
            <Card className="bg-card/80 border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-indigo-500" />Team Management</CardTitle>
                <Button onClick={() => setShowAddMember(true)} size="sm"><Plus className="w-4 h-4 mr-2" />Add Member</Button>
              </CardHeader>
              <CardContent>
                {teamMembers.length === 0 ? (
                  <div className="text-center py-12"><Users className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">No team members yet</p></div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member) => (
                      <div key={member.id} className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {member.image_url ? <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-primary" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground">{member.name}</h4>
                            <p className="text-sm text-primary">{member.role}</p>
                            {member.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{member.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-4">
                          <Button variant="ghost" size="sm" onClick={() => setEditingMember(member)}><Edit className="w-4 h-4" /></Button>
                          <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Team Member?</AlertDialogTitle><AlertDialogDescription>This will remove "{member.name}" from the team.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteMember(member.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Licenses Tab */}
          <TabsContent value="licenses">
            <Card className="bg-card/80 border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-amber-500" />Licenses & Certifications</CardTitle>
                <Button onClick={() => setShowAddLicense(true)} size="sm"><Plus className="w-4 h-4 mr-2" />Add License</Button>
              </CardHeader>
              <CardContent>
                {licenses.length === 0 ? (
                  <div className="text-center py-12"><Award className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">No licenses or certifications yet</p></div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {licenses.map((license) => (
                      <div key={license.id} className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors">
                        {license.image_url && (
                          <div className="mb-3 rounded-lg overflow-hidden bg-muted/30">
                            <img src={license.image_url} alt={license.title} className="w-full h-32 object-contain p-2" />
                          </div>
                        )}
                        <h4 className="font-semibold text-foreground">{license.title}</h4>
                        {license.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{license.description}</p>}
                        <div className="flex items-center justify-end gap-2 mt-4">
                          <Button variant="ghost" size="sm" onClick={() => setEditingLicense(license)}><Edit className="w-4 h-4" /></Button>
                          <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete License?</AlertDialogTitle><AlertDialogDescription>This will remove "{license.title}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteLicense(license.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Brands Tab */}
          <TabsContent value="brands">
            <Card className="bg-card/80 border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2"><Building2 className="w-5 h-5 text-purple-500" />Brand Management</CardTitle>
                <Button onClick={() => setShowAddBrand(true)} size="sm"><Plus className="w-4 h-4 mr-2" />Add Brand</Button>
              </CardHeader>
              <CardContent>
                {brands.length === 0 ? (
                  <div className="text-center py-12"><Building2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" /><p className="text-muted-foreground">No brands yet</p></div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {brands.map((brand) => (
                      <div key={brand.id} className="p-4 rounded-lg bg-background/50 border border-border hover:border-primary/30 transition-colors">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {brand.logo_url ? <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain p-2" /> : <span className="text-2xl font-bold text-primary">{brand.name.charAt(0)}</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-foreground">{brand.name}</h4>
                            {brand.description && <p className="text-sm text-muted-foreground">{brand.description}</p>}
                            {brand.website_url && <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"><Globe className="w-3 h-3" />Visit Website</a>}
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-2 mt-4">
                          <Button variant="ghost" size="sm" onClick={() => setEditingBrand(brand)}><Edit className="w-4 h-4" /></Button>
                          <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="sm" className="text-destructive hover:text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Brand?</AlertDialogTitle><AlertDialogDescription>This will remove "{brand.name}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteBrand(brand.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social">
            <Card className="bg-card/80 border-border">
              <CardHeader><CardTitle className="flex items-center gap-2"><Share2 className="w-5 h-5 text-pink-500" />Social Media Links</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Add your social media profile URLs. Leave empty to hide from the footer.</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { key: "social_facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage" },
                    { key: "social_instagram", label: "Instagram", placeholder: "https://instagram.com/yourpage" },
                    { key: "social_linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/yourpage" },
                    { key: "social_twitter", label: "Twitter / X", placeholder: "https://twitter.com/yourpage" },
                    { key: "social_youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
                    { key: "social_tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourpage" },
                    { key: "social_whatsapp", label: "WhatsApp", placeholder: "https://wa.me/923001234567" },
                  ].map((social) => (
                    <div key={social.key} className="space-y-2">
                      <label className="text-sm font-medium text-foreground">{social.label}</label>
                      <Input
                        value={socialLinks[social.key] || ''}
                        onChange={(e) => setSocialLinks({ ...socialLinks, [social.key]: e.target.value })}
                        placeholder={social.placeholder}
                      />
                    </div>
                  ))}
                </div>
                <Button onClick={handleSaveSocialLinks} disabled={savingSocial} className="w-full sm:w-auto">
                  {savingSocial ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Saving...</span>) : (<span className="flex items-center gap-2"><Save className="w-4 h-4" />Save Social Links</span>)}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Settings Tab */}
          <TabsContent value="contact">
            <Card className="bg-card/80 border-border">
              <CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="w-5 h-5 text-rose-500" />Contact Information Settings</CardTitle></CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground flex items-center gap-2"><MapPin className="w-4 h-4" />Address</label><Input value={contactSettings.contact_address || ''} onChange={(e) => setContactSettings({ ...contactSettings, contact_address: e.target.value })} placeholder="Main Market, Lahore, Punjab, Pakistan" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground flex items-center gap-2"><Phone className="w-4 h-4" />Phone 1</label><Input value={contactSettings.contact_phone_1 || ''} onChange={(e) => setContactSettings({ ...contactSettings, contact_phone_1: e.target.value })} placeholder="+92 300 1234567" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground flex items-center gap-2"><Phone className="w-4 h-4" />Phone 2</label><Input value={contactSettings.contact_phone_2 || ''} onChange={(e) => setContactSettings({ ...contactSettings, contact_phone_2: e.target.value })} placeholder="+92 42 1234567" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground flex items-center gap-2"><Mail className="w-4 h-4" />Email 1</label><Input value={contactSettings.contact_email_1 || ''} onChange={(e) => setContactSettings({ ...contactSettings, contact_email_1: e.target.value })} placeholder="info@amantraders.com" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground flex items-center gap-2"><Mail className="w-4 h-4" />Email 2</label><Input value={contactSettings.contact_email_2 || ''} onChange={(e) => setContactSettings({ ...contactSettings, contact_email_2: e.target.value })} placeholder="sales@amantraders.com" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground flex items-center gap-2"><Clock className="w-4 h-4" />Business Hours</label><Input value={contactSettings.business_hours || ''} onChange={(e) => setContactSettings({ ...contactSettings, business_hours: e.target.value })} placeholder="Mon - Sat: 9:00 AM - 7:00 PM | Sunday: Closed" /></div>
                </div>
                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="font-semibold text-foreground">Google Maps Integration</h3>
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground flex items-center gap-2"><Link className="w-4 h-4" />Google Maps URL (for redirect)</label><Input value={contactSettings.google_maps_url || ''} onChange={(e) => setContactSettings({ ...contactSettings, google_maps_url: e.target.value })} placeholder="https://maps.google.com/?q=31.5204,74.3587" /><p className="text-xs text-muted-foreground">Users will be redirected to this URL when they click "View Location"</p></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground flex items-center gap-2"><Globe className="w-4 h-4" />Google Maps Embed URL</label><Textarea value={contactSettings.google_maps_embed || ''} onChange={(e) => setContactSettings({ ...contactSettings, google_maps_embed: e.target.value })} placeholder="https://www.google.com/maps/embed?pb=..." rows={3} /><p className="text-xs text-muted-foreground">Embed URL for displaying the map on the website</p></div>
                </div>
                <Button onClick={handleSaveContactSettings} disabled={savingSettings} className="w-full sm:w-auto">
                  {savingSettings ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Saving...</span>) : (<span className="flex items-center gap-2"><Save className="w-4 h-4" />Save Contact Settings</span>)}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-card/80 border-border">
              <CardHeader><CardTitle className="flex items-center gap-2"><Settings className="w-5 h-5 text-primary" />Account Settings</CardTitle></CardHeader>
              <CardContent className="space-y-8">
                {/* Logo Upload */}
                <div className="max-w-md">
                  <h3 className="font-semibold text-foreground mb-4">Site Logo</h3>
                  <p className="text-sm text-muted-foreground mb-4">Upload a logo to replace the default "AT" icon in the navbar and footer.</p>
                  {currentLogoUrl && (
                    <div className="mb-4 p-4 bg-secondary/50 rounded-lg inline-block">
                      <img src={currentLogoUrl} alt="Current logo" className="w-20 h-20 object-contain" />
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      ref={logoFileInputRef}
                      onChange={(e) => setSiteLogoFile(e.target.files?.[0] || null)}
                      className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                    />
                    <Button
                      disabled={!siteLogoFile || uploadingLogo}
                      onClick={async () => {
                        if (!siteLogoFile) return;
                        setUploadingLogo(true);
                        try {
                          const fileExt = siteLogoFile.name.split('.').pop();
                          const fileName = `site-logo-${Date.now()}.${fileExt}`;
                          const { error: uploadError } = await supabase.storage.from('site-logos').upload(fileName, siteLogoFile);
                          if (uploadError) throw uploadError;
                          const { data: urlData } = supabase.storage.from('site-logos').getPublicUrl(fileName);
                          const logoUrl = urlData.publicUrl;
                          const { error: settingError } = await supabase.from('site_settings').upsert({ setting_key: 'site_logo_url', setting_value: logoUrl }, { onConflict: 'setting_key' });
                          if (settingError) throw settingError;
                          setCurrentLogoUrl(logoUrl);
                          setSiteLogoFile(null);
                          if (logoFileInputRef.current) logoFileInputRef.current.value = '';
                          toast({ title: "Logo Updated", description: "Refresh the page to see the new logo." });
                        } catch (error: any) { toast({ title: "Upload Failed", description: error.message, variant: "destructive" }); }
                        finally { setUploadingLogo(false); }
                      }}
                    >
                      {uploadingLogo ? (
                        <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Uploading...</span>
                      ) : (
                        <><Upload className="w-4 h-4 mr-2" />Upload</>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Change Password */}
                <div className="max-w-md">
                  <h3 className="font-semibold text-foreground mb-4">Change Password</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">New Password</label>
                      <div className="relative">
                        <Input type={showPasswords ? "text" : "password"} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} placeholder="Enter new password" />
                        <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPasswords(!showPasswords)}>{showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</Button>
                      </div>
                    </div>
                    <div className="space-y-2"><label className="text-sm font-medium text-foreground">Confirm New Password</label><Input type={showPasswords ? "text" : "password"} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} placeholder="Confirm new password" /></div>
                    <Button onClick={handleChangePassword} disabled={isChangingPassword || !passwordData.newPassword}>
                      {isChangingPassword ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Updating...</span>) : "Update Password"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Message Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selectedMessage?.subject}</DialogTitle></DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-muted-foreground">From:</span><p className="font-medium text-foreground">{selectedMessage.name}</p></div>
                <div><span className="text-muted-foreground">Email:</span><p className="font-medium text-foreground">{selectedMessage.email}</p></div>
                {selectedMessage.phone && <div><span className="text-muted-foreground">Phone:</span><p className="font-medium text-foreground">{selectedMessage.phone}</p></div>}
                <div><span className="text-muted-foreground">Date:</span><p className="font-medium text-foreground">{formatDate(selectedMessage.created_at)}</p></div>
              </div>
              <div><span className="text-sm text-muted-foreground">Message:</span><p className="mt-2 p-4 rounded-lg bg-secondary/50 text-foreground">{selectedMessage.message}</p></div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedMessage(null)}>Close</Button>
            {selectedMessage?.email && (
              <Button asChild><a href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}&body=${encodeURIComponent(`Hello ${selectedMessage.name},\n\n\n---\nOriginal message:\n${selectedMessage.message}\n`)}`}>Reply</a></Button>
            )}
            <AlertDialog><AlertDialogTrigger asChild><Button variant="destructive"><Trash2 className="w-4 h-4 mr-2" />Delete</Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete Message?</AlertDialogTitle><AlertDialogDescription>This will permanently delete this message.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => selectedMessage && handleDeleteMessage(selectedMessage.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent><DialogHeader><DialogTitle>Add New Product</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Category *</label><select className="w-full p-2 rounded-md border border-border bg-background text-foreground" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}><option value="">Select category</option>{categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}</select></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Product Name *</label><Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Enter product name" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Description (optional)</label><Textarea value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} placeholder="Enter product description" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddProduct(false)}>Cancel</Button><Button onClick={handleAddProduct}><Plus className="w-4 h-4 mr-2" />Add Product</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit Product</DialogTitle></DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Product Name</label><Input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Description</label><Textarea value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} /></div>
              <div className="flex items-center gap-2"><input type="checkbox" id="available" checked={editingProduct.is_available} onChange={(e) => setEditingProduct({ ...editingProduct, is_available: e.target.checked })} className="rounded" /><label htmlFor="available" className="text-sm font-medium text-foreground">Available</label></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button><Button onClick={handleUpdateProduct}><Save className="w-4 h-4 mr-2" />Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent><DialogHeader><DialogTitle>Add New Category</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Category Name *</label><Input value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} placeholder="Enter category name" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Description (optional)</label><Textarea value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} placeholder="Enter category description" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Icon Name</label><Input value={newCategory.icon_name} onChange={(e) => setNewCategory({ ...newCategory, icon_name: e.target.value })} placeholder="Package, Stethoscope, Heart, etc." /><p className="text-xs text-muted-foreground">Lucide icon name (e.g., Package, Stethoscope, Heart, Syringe)</p></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddCategory(false)}>Cancel</Button><Button onClick={handleAddCategory}><Plus className="w-4 h-4 mr-2" />Add Category</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
        <DialogContent><DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>
          {editingCategory && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Category Name</label><Input value={editingCategory.name} onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Description</label><Textarea value={editingCategory.description || ""} onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Icon Name</label><Input value={editingCategory.icon_name} onChange={(e) => setEditingCategory({ ...editingCategory, icon_name: e.target.value })} /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => setEditingCategory(null)}>Cancel</Button><Button onClick={handleUpdateCategory}><Save className="w-4 h-4 mr-2" />Save Changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Team Member Dialog */}
      <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
        <DialogContent><DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Name *</label><Input value={newMember.name} onChange={(e) => setNewMember({ ...newMember, name: e.target.value })} placeholder="Enter member name" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Role *</label><Input value={newMember.role} onChange={(e) => setNewMember({ ...newMember, role: e.target.value })} placeholder="e.g., CEO, Sales Manager" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Description</label><Textarea value={newMember.description} onChange={(e) => setNewMember({ ...newMember, description: e.target.value })} placeholder="Brief description about the team member" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Profile Picture</label><input type="file" accept="image/*" onChange={(e) => setMemberImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => { setShowAddMember(false); setMemberImageFile(null); }}>Cancel</Button><Button onClick={handleAddMember} disabled={uploadingImage}>{uploadingImage ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Adding...</span>) : (<><Plus className="w-4 h-4 mr-2" />Add Member</>)}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Team Member Dialog */}
      <Dialog open={!!editingMember} onOpenChange={() => { setEditingMember(null); setMemberImageFile(null); }}>
        <DialogContent><DialogHeader><DialogTitle>Edit Team Member</DialogTitle></DialogHeader>
          {editingMember && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Name</label><Input value={editingMember.name} onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Role</label><Input value={editingMember.role} onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Description</label><Textarea value={editingMember.description || ""} onChange={(e) => setEditingMember({ ...editingMember, description: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Profile Picture</label>{editingMember.image_url && <div className="mb-2"><img src={editingMember.image_url} alt="Current" className="w-16 h-16 rounded-full object-cover" /></div>}<input type="file" accept="image/*" onChange={(e) => setMemberImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => { setEditingMember(null); setMemberImageFile(null); }}>Cancel</Button><Button onClick={handleUpdateMember} disabled={uploadingImage}>{uploadingImage ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Saving...</span>) : (<><Save className="w-4 h-4 mr-2" />Save Changes</>)}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Brand Dialog */}
      <Dialog open={showAddBrand} onOpenChange={setShowAddBrand}>
        <DialogContent><DialogHeader><DialogTitle>Add New Brand</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Brand Name *</label><Input value={newBrand.name} onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })} placeholder="Enter brand name" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Description</label><Input value={newBrand.description} onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })} placeholder="e.g., Medical Devices" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Website URL</label><Input value={newBrand.website_url} onChange={(e) => setNewBrand({ ...newBrand, website_url: e.target.value })} placeholder="https://www.example.com" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Brand Logo (optional)</label><input type="file" accept="image/*" onChange={(e) => setBrandLogoFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => { setShowAddBrand(false); setBrandLogoFile(null); }}>Cancel</Button><Button onClick={handleAddBrand} disabled={uploadingImage}>{uploadingImage ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Adding...</span>) : (<><Plus className="w-4 h-4 mr-2" />Add Brand</>)}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Brand Dialog */}
      <Dialog open={!!editingBrand} onOpenChange={() => { setEditingBrand(null); setBrandLogoFile(null); }}>
        <DialogContent><DialogHeader><DialogTitle>Edit Brand</DialogTitle></DialogHeader>
          {editingBrand && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Brand Name</label><Input value={editingBrand.name} onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Description</label><Input value={editingBrand.description || ""} onChange={(e) => setEditingBrand({ ...editingBrand, description: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Website URL</label><Input value={editingBrand.website_url || ""} onChange={(e) => setEditingBrand({ ...editingBrand, website_url: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Brand Logo</label>{editingBrand.logo_url && <div className="mb-2"><img src={editingBrand.logo_url} alt="Current logo" className="w-16 h-16 rounded-lg object-contain bg-muted p-2" /></div>}<input type="file" accept="image/*" onChange={(e) => setBrandLogoFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => { setEditingBrand(null); setBrandLogoFile(null); }}>Cancel</Button><Button onClick={handleUpdateBrand} disabled={uploadingImage}>{uploadingImage ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Saving...</span>) : (<><Save className="w-4 h-4 mr-2" />Save Changes</>)}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add License Dialog */}
      <Dialog open={showAddLicense} onOpenChange={setShowAddLicense}>
        <DialogContent><DialogHeader><DialogTitle>Add License / Certificate</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Title *</label><Input value={newLicense.title} onChange={(e) => setNewLicense({ ...newLicense, title: e.target.value })} placeholder="e.g., ISO 9001 Certified" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Description</label><Textarea value={newLicense.description} onChange={(e) => setNewLicense({ ...newLicense, description: e.target.value })} placeholder="Details about the license or certification" /></div>
            <div className="space-y-2"><label className="text-sm font-medium text-foreground">Certificate Image</label><input type="file" accept="image/*" onChange={(e) => setLicenseImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => { setShowAddLicense(false); setLicenseImageFile(null); }}>Cancel</Button><Button onClick={handleAddLicense} disabled={uploadingImage}>{uploadingImage ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Adding...</span>) : (<><Plus className="w-4 h-4 mr-2" />Add License</>)}</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit License Dialog */}
      <Dialog open={!!editingLicense} onOpenChange={() => { setEditingLicense(null); setLicenseImageFile(null); }}>
        <DialogContent><DialogHeader><DialogTitle>Edit License / Certificate</DialogTitle></DialogHeader>
          {editingLicense && (
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Title</label><Input value={editingLicense.title} onChange={(e) => setEditingLicense({ ...editingLicense, title: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Description</label><Textarea value={editingLicense.description || ""} onChange={(e) => setEditingLicense({ ...editingLicense, description: e.target.value })} /></div>
              <div className="space-y-2"><label className="text-sm font-medium text-foreground">Certificate Image</label>{editingLicense.image_url && <div className="mb-2"><img src={editingLicense.image_url} alt="Current" className="w-32 h-20 rounded-lg object-contain bg-muted p-2" /></div>}<input type="file" accept="image/*" onChange={(e) => setLicenseImageFile(e.target.files?.[0] || null)} className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90" /></div>
            </div>
          )}
          <DialogFooter><Button variant="outline" onClick={() => { setEditingLicense(null); setLicenseImageFile(null); }}>Cancel</Button><Button onClick={handleUpdateLicense} disabled={uploadingImage}>{uploadingImage ? (<span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />Saving...</span>) : (<><Save className="w-4 h-4 mr-2" />Save Changes</>)}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
