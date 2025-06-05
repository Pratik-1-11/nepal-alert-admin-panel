
export interface NewsData {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  category: string;
  source: string;
}

export const fetchNepalNews = async (): Promise<NewsData[]> => {
  try {
    const response = await fetch('https://apinp.com/news/api.php');
    
    if (!response.ok) {
      throw new Error('Failed to fetch news data');
    }
    
    const data = await response.json();
    
    // Transform the API response to match our interface
    return data.map((article: any, index: number) => ({
      id: article.id || index.toString(),
      title: article.title || article.headline || '',
      content: article.content || article.description || article.summary || '',
      image: article.image || article.thumbnail || '',
      date: article.date || article.published_at || new Date().toISOString(),
      category: article.category || 'general',
      source: 'Nepal News API',
    }));
  } catch (error) {
    console.error('Error fetching news data:', error);
    return [];
  }
};
