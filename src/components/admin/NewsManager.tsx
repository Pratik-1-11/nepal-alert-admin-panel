import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, RefreshCw, ExternalLink } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { NewsArticle } from '@/types/management';
import { fetchNepalNews, NewsData } from '@/services/newsService';
import { useToast } from '@/hooks/use-toast';

const NewsManager = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [newsData, setNewsData] = useState<NewsData[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<NewsArticle>({
    defaultValues: {
      title: '',
      content: '',
      author: '',
      category: 'general',
      status: 'draft',
      priority: 'medium',
      region: '',
      createdAt: new Date(),
    },
  });

  useEffect(() => {
    loadNewsData();
  }, []);

  const loadNewsData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchNepalNews();
      setNewsData(data);
      toast({
        title: 'Success',
        description: `Loaded ${data.length} news articles from Nepal News API`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load news data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const importNewsAsArticle = (news: NewsData) => {
    const newArticle: NewsArticle = {
      id: Date.now().toString(),
      title: news.title,
      content: news.content,
      author: news.source,
      category: 'general',
      status: 'published',
      priority: 'medium',
      region: 'Nepal',
      createdAt: new Date(news.date),
      imageUrl: news.image,
    };
    setArticles([...articles, newArticle]);
    toast({
      title: 'Success',
      description: 'News article imported successfully',
    });
  };

  const onSubmit = (data: NewsArticle) => {
    if (editingArticle) {
      setArticles(articles.map(article => article.id === editingArticle.id ? { ...data, id: editingArticle.id } : article));
    } else {
      setArticles([...articles, { ...data, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
    setEditingArticle(null);
    form.reset();
  };

  const handleEdit = (article: NewsArticle) => {
    setEditingArticle(article);
    form.reset(article);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'disaster': return 'bg-red-100 text-red-800';
      case 'preparedness': return 'bg-yellow-100 text-yellow-800';
      case 'recovery': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            News Management
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={loadNewsData} disabled={isLoading} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh News
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Article
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingArticle ? 'Edit Article' : 'Add New Article'}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter article title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Enter article content" rows={4} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="author"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Author</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter author name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter region" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="disaster">Disaster</SelectItem>
                                <SelectItem value="preparedness">Preparedness</SelectItem>
                                <SelectItem value="recovery">Recovery</SelectItem>
                                <SelectItem value="general">General</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Priority</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        {editingArticle ? 'Update' : 'Create'}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nepal News API Data Section */}
          {newsData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Latest News from Nepal API</h3>
              <div className="grid gap-2 max-h-60 overflow-y-auto">
                {newsData.slice(0, 10).map((news, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex-1">
                      <div className="font-medium line-clamp-1">{news.title}</div>
                      <div className="text-sm text-gray-500 line-clamp-2">{news.content}</div>
                      <div className="text-xs text-gray-400">{new Date(news.date).toLocaleDateString()}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => importNewsAsArticle(news)}
                    >
                      Import
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Managed Articles Table */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Managed Articles</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.author}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(article.category)}>{article.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(article.status)}>{article.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(article.priority)}>{article.priority}</Badge>
                    </TableCell>
                    <TableCell>{article.region}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(article)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(article.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsManager;
