'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { jsPDF } from 'jspdf';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog"

export function MindfulGenerator() {
  // 状态定义
  const [description, setDescription] = useState('')
  const [emotion, setEmotion] = useState('')
  const [theme, setTheme] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [complexity, setComplexity] = useState('medium')
  const [aspectRatio, setAspectRatio] = useState('1:1')

  // 选项数据
  const emotions = [
    { id: 'anxious', label: 'Anxious' },
    { id: 'overwhelmed', label: 'Overwhelmed' },
    { id: 'restless', label: 'Restless' },
    { id: 'seeking-peace', label: 'Seeking Peace' },
    { id: 'need-grounding', label: 'Need Grounding' },
    { id: 'want-inspiration', label: 'Want Inspiration' }
  ]

  const themes = [
    // 传统正念元素
    { id: 'mandala', label: 'Mandala' },
    { id: 'zen-circle', label: 'Zen Circle' },
    { id: 'sacred-geometry', label: 'Sacred Geometry' },
    { id: 'lotus-pattern', label: 'Lotus Pattern' },

    // 自然意象
    { id: 'ocean-waves', label: 'Ocean Waves' },
    { id: 'forest-path', label: 'Forest Path' },
    { id: 'garden-sanctuary', label: 'Garden Sanctuary' },
    { id: 'mountain-vista', label: 'Mountain Vista' },
    { id: 'bamboo-grove', label: 'Bamboo Grove' },
    { id: 'flowing-stream', label: 'Flowing Stream' },
    { id: 'moon-phases', label: 'Moon Phases' },
    { id: 'tree-of-life', label: 'Tree of Life' },

    // 元素意境
    { id: 'floating-clouds', label: 'Floating Clouds' },
    { id: 'gentle-rain', label: 'Gentle Rain' },
    { id: 'dancing-leaves', label: 'Dancing Leaves' },
    { id: 'wind-patterns', label: 'Wind Patterns' },
    { id: 'crystal-forms', label: 'Crystal Forms' },
    { id: 'light-rays', label: 'Light Rays' },

    // 抽象概念
    { id: 'flow-states', label: 'Flow States' },
    { id: 'energy-fields', label: 'Energy Fields' },
    { id: 'infinity-paths', label: 'Infinity Paths' },
    { id: 'balance-forms', label: 'Balance Forms' },
    { id: 'ripple-effects', label: 'Ripple Effects' },
    { id: 'mindful-spaces', label: 'Mindful Spaces' },

    // 情绪疗愈
    { id: 'comfort-cocoon', label: 'Comfort Cocoon' },
    { id: 'peace-portal', label: 'Peace Portal' },
    { id: 'serenity-spirals', label: 'Serenity Spirals' },
    { id: 'gratitude-garden', label: 'Gratitude Garden' },
    { id: 'joy-bubbles', label: 'Joy Bubbles' },
    { id: 'release-ribbons', label: 'Release Ribbons' }
  ]

  const complexityOptions = [
    { id: 'simple', label: 'Simple', detail: 'low detail' },
    { id: 'medium', label: 'Medium', detail: 'medium detail' },
    { id: 'detailed', label: 'Detailed', detail: 'highly detailed' }
  ]

  const aspectRatioOptions = [
    { id: '1:1', label: 'Square', description: '1:1', prompt: 'square format' },
    { id: '2:3', label: 'Portrait', description: '2:3', prompt: 'vertical portrait format' },
    { id: '3:2', label: 'Landscape', description: '3:2', prompt: 'horizontal landscape format' }
  ]

  // 主题分组数据，包含颜色和描述
  const themeCategories = [
    {
      title: "Traditional Mindfulness",
      borderColor: "border-gray-300",
      themes: themes.slice(0, 4)
    },
    {
      title: "Natural Elements",
      borderColor: "border-sage-500",
      themes: themes.slice(4, 12)
    },
    {
      title: "Elemental Patterns",
      borderColor: "border-emerald-700",
      themes: themes.slice(12, 18)
    },
    {
      title: "Abstract Concepts",
      borderColor: "border-gray-500",
      themes: themes.slice(18, 24)
    },
    {
      title: "Emotional Healing",
      borderColor: "border-gray-400",
      themes: themes.slice(24)
    }
  ];

  // 主题风格映射
  const themeStyles = {
    'traditional-mindfulness': 'mandala-inspired',
    'natural-elements': 'nature-inspired',
    'elemental-patterns': 'elemental-inspired',
    'abstract-concepts': 'abstract-inspired',
    'emotional-healing': 'healing-inspired'
  } as const;

  // 主题特定图案映射
  const themeSpecificPatterns = {
    'traditional-mindfulness': 'sacred geometric patterns that radiate harmony',
    'natural-elements': 'organic flowing patterns that embrace nature',
    'elemental-patterns': 'ethereal swirling patterns that dance with grace',
    'abstract-concepts': 'dynamic energy lines that flow with purpose',
    'emotional-healing': 'gentle embracing patterns that nurture peace'
  } as const;

  // 情绪状态映射更新
  const emotionalStates = {
    'anxious': 'seeking calm and gentle reassurance',
    'overwhelmed': 'finding space and inner peace',
    'restless': 'discovering stillness and focus',
    'seeking-peace': 'embracing tranquility and harmony',
    'need-grounding': 'finding stability and connection',
    'want-inspiration': 'seeking uplift and creative flow'
  } as const;

  // 情绪品质特征映射
  const emotionalQualities = {
    'anxious': {
      quality: 'calming flow',
      features: [
        'gentle, flowing lines',
        'rounded corners',
        'soft transitions'
      ]
    },
    'overwhelmed': {
      quality: 'spacious breathing room',
      features: [
        'generous white space',
        'clear focal points',
        'uncluttered composition'
      ]
    },
    'restless': {
      quality: 'gentle structure',
      features: [
        'balanced rhythms',
        'predictable patterns',
        'soothing repetition'
      ]
    },
    'seeking-peace': {
      quality: 'harmonious balance',
      features: [
        'symmetrical elements',
        'equal visual weight',
        'unified composition'
      ]
    },
    'need-grounding': {
      quality: 'stable foundation',
      features: [
        'strong base elements',
        'centered composition',
        'anchoring patterns'
      ]
    },
    'want-inspiration': {
      quality: 'uplifting movement',
      features: [
        'rising patterns',
        'dynamic flow',
        'energetic elements'
      ]
    }
  } as const;

  // 主题类别特征映射
  const themePatterns = {
    'traditional-mindfulness': {
      pattern: 'sacred geometric patterns, mandalas',
      style: 'symmetrical, centered compositions',
      background: 'radiating patterns'
    },
    'natural-elements': {
      pattern: 'organic flowing patterns, nature motifs',
      style: 'fluid, natural compositions',
      background: 'gentle nature-inspired elements'
    },
    'elemental-patterns': {
      pattern: 'ethereal swirling patterns',
      style: 'dynamic, flowing compositions',
      background: 'elemental symbols'
    },
    'abstract-concepts': {
      pattern: 'dynamic energy patterns',
      style: 'fluid, conceptual compositions',
      background: 'abstract flowing forms'
    },
    'emotional-healing': {
      pattern: 'gentle embracing patterns',
      style: 'nurturing, supportive compositions',
      background: 'protective, comforting elements'
    }
  } as const;

  // 角色处理逻辑更新
  function analyzeUserInput(description: string): {
    type: 'character' | 'scene' | 'pattern';
    count: 'single' | 'multiple';
  } {
    const characterKeywords = ['character', 'hello kitty', 'pokemon', 'animal', 'creature', 'person', 'figure'];
    const hasCharacter = characterKeywords.some(keyword => description.toLowerCase().includes(keyword));
    
    // 检测是否包含多个角色
    const multipleIndicators = [' and ', ' with ', ',', '&'];
    const hasMultiple = multipleIndicators.some(indicator => description.includes(indicator));
    
    return {
      type: hasCharacter ? 'character' : 'pattern',
      count: hasMultiple ? 'multiple' : 'single'
    };
  }

  // Prompt 构建函数更新
  function buildStructuredPrompt({
    emotion,
    theme,
    complexity,
    aspectRatio,
    description
  }: {
    emotion: string;
    theme: string;
    complexity: string;
    aspectRatio: string;
    description?: string;
  }) {
    const themeCategory = themeCategories.find(cat => 
      cat.themes.some(t => t.id === theme)
    )?.title.toLowerCase().replace(/\s+/g, '-') || '';

    const emotionalState = emotionalStates[emotion as keyof typeof emotionalStates];
    const emotionalQuality = emotionalQualities[emotion as keyof typeof emotionalQualities];
    const themePattern = themePatterns[themeCategory as keyof typeof themePatterns];
    
    const input = description ? analyzeUserInput(description) : { type: 'pattern', count: 'single' };
    
    let prompt = `Create a mindful ${emotionalState} coloring page featuring ${
      description || theme.replace('-', ' ')
    } with ${complexity} detail.`;

    // 添加角色处理指导
    if (input.type === 'character') {
      prompt += `\n\nCharacter styling:\n${
        input.count === 'multiple' ? 
        `- Create harmonious interaction between characters
         - Balance sizes and positions
         - Maintain individual character essence while creating unity
         - Ensure all mentioned characters are included
         - Create meaningful interaction that tells a story` :
        `- Maintain authentic features while adding mindful elements
         - Position in a meditative or peaceful pose
         - Create serene expression
         - Surround with theme-appropriate patterns`
      }`;
    }

    // 添加主题和情感品质指导
    prompt += `\n\nComposition Guidelines:
    - Style: ${themePattern.style}
    - Pattern: ${themePattern.pattern}
    - Background: ${themePattern.background}
    - Features: ${emotionalQuality.features.join(', ')}
    
    The design should create clear, flowing outlines suitable for therapeutic coloring.
    Maintain generous white space with mindful pattern spacing.
    The background should remain completely white.`;

    return prompt.trim().replace(/\s+/g, ' ');
  }

  const handleGenerate = async () => {
    try {
      setIsLoading(true)
      
      const structuredPrompt = buildStructuredPrompt({
        emotion,
        theme,
        complexity,
        aspectRatio,
        description
      });
      
      console.log('Frontend - Sending prompt:', structuredPrompt);
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: structuredPrompt,
          aspectRatio,
          complexity
        }),
      });

      console.log('Frontend - Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Frontend - API error:', errorData)
        throw new Error(errorData.error || errorData.details || 'Failed to generate image')
      }

      const blob = await response.blob()
      console.log('Frontend - Blob size:', blob.size, 'Blob type:', blob.type)
      
      if (!blob || blob.size === 0) {
        throw new Error('Empty image response')
      }

      const url = URL.createObjectURL(blob)
      console.log('Frontend - Created URL:', url)
      setImageUrl(url)

    } catch (error: unknown) {
      console.error('Frontend - Generation error:', error)
      if (error instanceof Error) {
        alert(error.message)
      } else {
        alert('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadPNG = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'mindful-coloring.png';
    link.click();
  };

  const handleDownloadPDF = async () => {
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      const pdf = new jsPDF({
        orientation: aspectRatio === "2:3" ? "portrait" : "landscape",
        unit: "px",
        format: [img.width, img.height]
      });
      
      pdf.addImage(img, 'PNG', 0, 0, img.width, img.height);
      pdf.save('mindful-coloring.pdf');
    };
  };

  return (
    <>
      {/* 页面标题和介绍 */}
      <div className="text-center mb-16 space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-light text-gray-800">Mindful Coloring</h1>
          <p className="text-gray-600">Transform moments into mindful art</p>
        </div>
        
        <div className="max-w-4xl mx-auto px-4 text-gray-600 leading-relaxed">
          <p>
            Ready to create some mindful magic? Just tell us what&apos;s on your mind, pick how you&apos;re feeling, 
            and choose a theme that clicks with you. Our AI will weave it all into a unique coloring page 
            that&apos;s yours to bring to life. Think of it as your personal calm-creating machine, but way 
            more fun than that sounds! Download, print, and let those colors flow.
          </p>
          <p className="mt-2 text-gray-500 font-light">
            ✨ No artistic skills required - just your imagination and a few clicks!
          </p>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 max-w-7xl mx-auto">
        {/* 左侧：选项面板 */}
        <Card className="bg-white/50 backdrop-blur">
          <CardContent className="p-8 space-y-8">
            {/* 文本输入区域 */}
            <div className="space-y-4">
              <h2 className="text-lg font-light text-gray-700">Describe what you would like to create</h2>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Express your vision here... For example: A peaceful scene with gentle waves under moonlight"
                className="min-h-[100px] bg-white/80 text-gray-700 resize-none"
              />
            </div>

            {/* 情绪选择 */}
            <div className="space-y-4">
              <h2 className="text-lg font-light text-gray-700">How are you feeling right now?</h2>
              <div className="grid grid-cols-3 gap-3">
                {emotions.map(item => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className={`w-full ${
                      emotion === item.id ? 'bg-gray-100 border-gray-400' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setEmotion(item.id)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* 主题选择 - 按类别分组显示 */}
            <div className="space-y-6">
              <h2 className="text-lg font-light text-gray-700">What theme resonates with you?</h2>
              {themeCategories.map(category => (
                <div key={category.title} className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-600">{category.title}</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {category.themes.map(item => (
                      <Button
                        key={item.id}
                        variant="outline"
                        className={`w-full text-sm ${
                          theme === item.id ? 'bg-gray-100 border-gray-400' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setTheme(item.id)}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* 复杂度和比例选择放在同一行 */}
            <div className="grid grid-cols-2 gap-8">
              {/* 复杂度选择 */}
              <div className="space-y-4">
                <h2 className="text-lg font-light text-gray-700">Pattern Complexity</h2>
                <div className="grid grid-cols-3 gap-3">
                  {complexityOptions.map(item => (
                    <Button
                      key={item.id}
                      variant="outline"
                      className={`w-full ${
                        complexity === item.id ? 'bg-gray-100 border-gray-400' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setComplexity(item.id)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 比例选择 */}
              <div className="space-y-4">
                <h2 className="text-lg font-light text-gray-700">Image Aspect Ratio</h2>
                <div className="grid grid-cols-3 gap-3">
                  {aspectRatioOptions.map(item => (
                    <Button
                      key={item.id}
                      variant="outline"
                      className={`w-full ${
                        aspectRatio === item.id ? 'bg-gray-100 border-gray-400' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setAspectRatio(item.id)}
                    >
                      {item.label}
                      <span className="text-xs text-gray-500 block">{item.description}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* 生成按钮 */}
            <Button 
              variant="generate"
              className="w-full"
              size="lg"
              disabled={isLoading || (!emotion && !description)}
              onClick={handleGenerate}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-4 w-4 border-2 border-gray-900 border-t-transparent rounded-full"></div>
                  Creating your mindful art...
                </span>
              ) : (
                'Create Your Coloring Page'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* 右侧：图片显示区域 */}
        <div className="w-full sticky top-8 h-fit space-y-8">
          {isLoading ? (
            <div className="text-center p-8 bg-white/50 backdrop-blur rounded-lg">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto"></div>
              <p className="mt-4 text-gray-600">
                Generating your mindful art...
                <br />
                <span className="text-sm text-gray-500">
                  This might take a minute or two
                </span>
              </p>
            </div>
          ) : imageUrl ? (
            <div className="w-full space-y-4">
              <Dialog>
                <DialogTrigger asChild>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden cursor-zoom-in hover:opacity-95 transition-opacity">
                    <img 
                      src={imageUrl} 
                      alt="Generated mindful art" 
                      className="w-full h-auto"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
                  <DialogTitle className="sr-only">
                    Mindful Coloring Preview
                  </DialogTitle>
                  <img 
                    src={imageUrl} 
                    alt="Generated mindful art" 
                    className="w-full h-full object-contain"
                  />
                </DialogContent>
              </Dialog>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={handleDownloadPNG}>
                  Download PNG
                </Button>
                <Button variant="outline" onClick={handleDownloadPDF}>
                  Download PDF
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-white/50 backdrop-blur">
              <p className="text-gray-500">Your mindful coloring page will appear here</p>
            </div>
          )}

          {/* FAQ 部分 */}
          <div className="space-y-4">
            <h2 className="text-xl font-medium text-gray-700 px-4">
              Frequently Asked Questions
            </h2>
            <Accordion 
              type="single" 
              collapsible 
              className="bg-white/50 backdrop-blur rounded-lg border border-gray-200"
            >
              <AccordionItem value="what-is">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  What is Mindful Coloring?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  Mindful Coloring is your creative companion for mindfulness practice - an AI-powered tool that transforms your ideas into meaningful coloring pages. Whether you&apos;re looking to de-stress, find focus, or simply enjoy a moment of creative calm, our tool combines your personal vision with mindful themes to create unique pages for coloring meditation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="how-it-works">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  How does Mindful Coloring work?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  Share your vision with us through simple words (like &quot;a peaceful garden with butterflies&quot;), choose how you&apos;re feeling, and select a mindful theme that speaks to you. Our AI will blend these elements into a unique coloring page that&apos;s perfect for your mindful practice. You can adjust the style and complexity until it feels just right.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="what-special">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  What makes Mindful Coloring special?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  We&apos;re unique because we blend art creation with mindfulness practice. Each theme and pattern is carefully designed to enhance your meditation and relaxation experience. Unlike regular coloring pages, ours are crafted to create moments of peace and presence.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="printing">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  Can I print the coloring pages?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  Absolutely! Every page is designed to be printer-friendly. You can download your creation in either PNG or PDF format and print it at home or at your local print shop. We optimize all pages for clear, crisp lines that are perfect for coloring.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="artistic-skills">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  Do I need any artistic skills?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  Not at all! All you need is your imagination and openness to mindful practice. Our tool is designed to be simple and intuitive - just share your thoughts, and we&apos;ll handle the artistic creation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="page-limits">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  How many pages can I create?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  <ul className="list-disc list-inside space-y-2">
                    <li>Free Soul membership: 10 free credits to start your journey</li>
                    <li>Peaceful Mind subscription: 150 creations per month</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="commercial-use">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  Can I use these pages commercially?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  Yes! All pages you generate are yours to use however you wish. Whether it&apos;s for personal meditation, teaching, or commercial projects, you have full rights to your creations.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="new-themes">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  How often do you add new themes?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  We regularly update our theme library with new mindful elements and patterns. We&apos;re constantly working with meditation experts and artists to bring you fresh inspiration for your practice.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="technology">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  What technology powers Mindful Coloring?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  We use advanced AI technology, but what makes us special is how we&apos;ve trained it specifically for mindful art creation. Our system understands the principles of meditation and peaceful art, ensuring each page supports your mindfulness journey.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="cancel-subscription">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  Can I cancel my subscription anytime?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  Yes, you have complete flexibility with your subscription. You can cancel at any time through your account settings, no questions asked.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="refunds">
                <AccordionTrigger className="px-4 hover:no-underline hover:bg-gray-50/50">
                  Do you offer refunds?
                </AccordionTrigger>
                <AccordionContent className="px-4 text-gray-600">
                  While we don&apos;t offer refunds for subscription payments, we encourage everyone to start with our Free Soul membership to experience our service before upgrading to a paid plan.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  )
}