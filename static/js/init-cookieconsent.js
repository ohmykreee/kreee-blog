CookieConsent.run({
  categories: {
    necessary: {
      enabled: true,
      readOnly: true
    },
    analytics: {
      enabled: true,
      readOnly: false
    }
  },

  onFirstConsent: ({ cookie }) => {
    cookie.categories.includes("analytics")? window.clarity("consent") : window.clarity("not", false)
  },

  onChange: ({ cookie, changedCategories, changedServices }) => {
    cookie.categories.includes("analytics")? window.clarity("consent") : window.clarity("not", false)
  },

  guiOptions: {
    consentModal: {
      layout: 'box wide',
      position: 'bottom right',
      flipButtons: false,
      equalWeightButtons: false
    },
    preferencesModal: {
      layout: 'box',
      position: 'right',
      flipButtons: false,
      equalWeightButtons: false
    }
  },

  language: {
    default: 'en',
    autoDetect: 'browser',
    translations: {
      zh: {
        consentModal: {
          title: '我们使用 Cookies',
          description: '我们通过使用 Microsoft Clarity 查看您如何使用我们的网站来改进我们的产品和广告。使用我们的网站即表示您同意我们和 Microsoft 可以收集并使用这些数据。更多详细信息请参见 <a href="https://privacy.microsoft.com/privacystatement" target="_blank">Microsoft 隐私声明</a>。',
          acceptAllBtn: '接受所有',
          acceptNecessaryBtn: '拒绝所有',
          showPreferencesBtn: '管理个人偏好'
        },
        preferencesModal: {
          title: '管理 Cookie 偏好',
          acceptAllBtn: '接受所有',
          acceptNecessaryBtn: '拒绝所有',
          savePreferencesBtn: '接受当前选择',
          closeIconLabel: '关闭窗口',
          sections: [
            {
              title: 'Cookie 使用',
              description: '我们与 Microsoft Clarity 和 Microsoft Advertising 合作，通过行为指标、热图和会话回放捕获您对我们网站的使用和交互情况，以改进和推广我们的产品/服务。网站使用数据通过第一方和第三方 Cookies 及其他跟踪技术捕获，用于确定产品/服务的受欢迎程度及在线活动。此外，我们将此信息用于网站优化、防欺诈/安全目的以及广告。有关 Microsoft 如何收集和使用您的数据的更多信息，请访问 <a href="https://privacy.microsoft.com/privacystatement" target="_blank">Microsoft 隐私声明</a>。您可以随时选择同意或退出。'
            },
            {
              title: '严格必要的 Cookies',
              description: '这些 Cookies 对于网站的正常运行至关重要，无法被禁用。',
              linkedCategory: 'necessary'
            },
            {
              title: '性能与分析',
              description: '这些 Cookies 收集您使用我们网站的相关信息。所有数据均已匿名化，无法用于识别您的身份。',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: "名称",
                  domain: "服务",
                  description: "描述"
                },
                body: [
                  {
                    name: "_clck",
                    domain: "Microsoft Clarity",
                    description: '由 <a target="_blank" href="https://clarity.microsoft.com/terms">Microsoft Clarity</a> 设置的 Cookie'
                  },
                  {
                    name: "_clsk",
                    domain: "Microsoft Clarity",
                    description: '由 <a target="_blank" href="https://clarity.microsoft.com/terms">Microsoft Clarity</a> 设置的 Cookie'
                  }
                ]
              }
            },
            {
              title: '更多信息',
              description: '如果您对 Cookie 政策及您的选择有任何疑问，请 <a href="https://clarity.microsoft.com/blog/cookies-in-clarity/" target="_blank">参阅 Microsoft 的这篇博客</a>。'
            }
          ]
        }
      },
      en: {
        consentModal: {
          title: 'We use cookies',
          description: 'We improve our products and advertising by using Microsoft Clarity to see how you use our website. By using our site, you agree that we and Microsoft can collect and use this data. More details can be found on <a href="https://privacy.microsoft.com/privacystatement" target="_blank">Microsoft Privacy Statement</a>.',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          showPreferencesBtn: 'Manage Individual preferences'
        },
        preferencesModal: {
          title: 'Manage cookie preferences',
          acceptAllBtn: 'Accept all',
          acceptNecessaryBtn: 'Reject all',
          savePreferencesBtn: 'Accept current selection',
          closeIconLabel: 'Close modal',
          sections: [
            {
              title: 'Cookie Usage',
              description: 'We partner with Microsoft Clarity and Microsoft Advertising to capture how you use and interact with our website through behavioral metrics, heatmaps, and session replay to improve and market our products/services. Website usage data is captured using first and third-party cookies and other tracking technologies to determine the popularity of products/services and online activity. Additionally, we use this information for site optimization, fraud/security purposes, and advertising. For more information about how Microsoft collects and uses your data, visit the <a href="https://privacy.microsoft.com/privacystatement" target="_blank">Microsoft Privacy Statement</a>. You can choose to opt-in/out whenever you want.'
            },
            {
              title: 'Strictly Necessary cookies',
              description: 'These cookies are essential for the proper functioning of the website and cannot be disabled.',
              linkedCategory: 'necessary'
            },
            {
              title: 'Performance and Analytics',
              description: 'These cookies collect information about how you use our website. All of the data is anonymized and cannot be used to identify you.',
              linkedCategory: 'analytics',
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Service",
                  description: "Description"
                },
                body: [
                  {
                    name: "_clck",
                    domain: "Microsoft Clarity",
                    description: 'Cookie set by <a target="_blank" href="https://clarity.microsoft.com/terms">Microsoft Clarity</a>'
                  },
                  {
                    name: "_clsk",
                    domain: "Microsoft Clarity",
                    description: 'Cookie set by <a target="_blank" href="https://clarity.microsoft.com/terms">Microsoft Clarity</a>'
                  }
                ]
              }
            },
            {
              title: 'More information',
              description: 'For any questions in relation to policy on cookies and your choices, please <a href="https://clarity.microsoft.com/blog/cookies-in-clarity/" target="_blank">refer to this blog from Microsoft</a>.'
            }
          ]
        }
      }
    }
  }
})

// 自动启用dark mode
new MutationObserver(() => {
  document.documentElement.classList.toggle(
    'cc--darkmode',
    document.documentElement.classList.contains('dark-mode')
  )
}).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ['class']
})