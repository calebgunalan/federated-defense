const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function transformMdpiToArticle(latex: string): string {
  let result = latex;

  // Replace MDPI document class with standard article
  result = result.replace(
    /\\documentclass\[.*?\]\{Definitions\/mdpi\}/,
    '\\documentclass[12pt,a4paper]{article}\n\\usepackage[margin=1in]{geometry}\n\\usepackage{authblk}'
  );

  // Handle \Title -> \title
  result = result.replace(/\\Title\{/, '\\title{');

  // Handle \Author -> \author
  result = result.replace(/\\Author\{/, '\\author{');

  // Remove \corres, \address, \orcidicon
  result = result.replace(/\\corres\{[^}]*\}/g, '');
  result = result.replace(/\\address\{[^}]*\}/g, '');
  result = result.replace(/\\orcidicon/g, '');
  result = result.replace(/\\href\{[^}]*\}\{\\orcidicon\}/g, '');

  // Handle \abstract{...} -> \begin{abstract}...\end{abstract}
  const abstractMatch = result.match(/\\abstract\{/);
  if (abstractMatch && abstractMatch.index !== undefined) {
    const startIdx = abstractMatch.index;
    const braceStart = startIdx + '\\abstract{'.length;
    let depth = 1;
    let i = braceStart;
    while (i < result.length && depth > 0) {
      if (result[i] === '{') depth++;
      if (result[i] === '}') depth--;
      i++;
    }
    const content = result.substring(braceStart, i - 1);
    result = result.substring(0, startIdx) +
      '\\begin{abstract}\n' + content + '\n\\end{abstract}' +
      result.substring(i);
  }

  // Handle \keyword{...} -> ignore
  const keywordMatch = result.match(/\\keyword\{/);
  if (keywordMatch && keywordMatch.index !== undefined) {
    const startIdx = keywordMatch.index;
    const braceStart = startIdx + '\\keyword{'.length;
    let depth = 1;
    let i = braceStart;
    while (i < result.length && depth > 0) {
      if (result[i] === '{') depth++;
      if (result[i] === '}') depth--;
      i++;
    }
    result = result.substring(0, startIdx) + result.substring(i);
  }

  // Add \maketitle after \begin{document}
  result = result.replace('\\begin{document}', '\\begin{document}\n\\maketitle');

  // Handle \extralength (define it)
  result = result.replace(
    '\\begin{document}',
    '\\newlength{\\extralength}\n\\setlength{\\extralength}{0cm}\n\\newcommand{\\reftitle}[1]{\\section*{#1}}\n\\begin{document}'
  );

  return result;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { latex } = await req.json();

    if (!latex || typeof latex !== 'string') {
      return new Response(JSON.stringify({ error: 'No LaTeX content provided' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const previewLatex = transformMdpiToArticle(latex);

    const response = await fetch('https://latex.ytotech.com/builds/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: 'pdflatex',
        resources: [{ main: true, content: previewLatex }],
      }),
    });

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/pdf')) {
      const pdfBuffer = await response.arrayBuffer();
      return new Response(pdfBuffer, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline; filename="manuscript.pdf"',
        },
      });
    } else {
      const errorText = await response.text();
      return new Response(JSON.stringify({
        error: 'Compilation failed',
        logs: errorText.substring(0, 5000),
      }), {
        status: 422,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
