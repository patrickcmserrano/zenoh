#!/usr/bin/env python3
"""
Gera arquivos de áudio MP3 a partir dos documentos Markdown do Projeto Zeno.
Usa edge-tts (Microsoft Neural TTS — gratuito, sem API key).

Uso:
  python3 scripts/generate-audio.py               # gera todos
  python3 scripts/generate-audio.py README.md     # gera um específico
  python3 scripts/generate-audio.py --list-voices # lista vozes disponíveis

Saída: docs-viewer/public/audio/<doc-slug>.mp3
"""

import asyncio
import re
import sys
import os
import json
from pathlib import Path

import edge_tts

# --- Configuração ---
VOICE = "pt-BR-AntonioNeural"
RATE  = "+0%"   # velocidade: "-10%" mais lento, "+15%" mais rápido
PITCH = "+0Hz"  # tom: "+50Hz" mais agudo, "-50Hz" mais grave

ROOT       = Path(__file__).parent.parent
DOCS_DIR   = ROOT
AUDIO_DIR  = ROOT / "docs-viewer" / "public" / "audio"
AUDIO_MAP  = ROOT / "docs-viewer" / "public" / "audio-map.json"

# Documentos a processar (em ordem de narração)
DOCS = [
    "docs/philosophy/constitution.md",
    "docs/philosophy/silicon-ego.md",
    "docs/architecture/overview.md",
    "docs/architecture/event-store.md",
    "docs/architecture/coherence-processor.md",
    "docs/architecture/dream-worker.md",
    "docs/roadmap/phases.md",
    "docs/roadmap/genesis-script.md",
]

# Prefixo a remover das chaves do audio-map (para bater com docs-list.json)
DOCS_PREFIX = "docs/"


def md_to_speech_text(md: str) -> str:
    """Converte Markdown em texto limpo para TTS."""
    text = md

    # Remove blocos de código (```...```)
    text = re.sub(r'```[\s\S]*?```', ' [trecho de código omitido] ', text)

    # Remove blocos Mermaid
    text = re.sub(r'```mermaid[\s\S]*?```', ' [diagrama omitido] ', text)

    # Remove inline code (`...`)
    text = re.sub(r'`[^`]+`', lambda m: m.group(0)[1:-1], text)

    # Converte linhas de tabela em texto legível
    def table_row(m):
        cells = [c.strip() for c in m.group(0).split('|') if c.strip() and c.strip() != '---' and not re.match(r'^[-:]+$', c.strip())]
        return ' — '.join(cells) + '. ' if cells else ''
    text = re.sub(r'^\|.*\|$', table_row, text, flags=re.MULTILINE)

    # Remove separadores de tabela
    text = re.sub(r'^\s*\|?[-:| ]+\|[-:| ]+\|?\s*$', '', text, flags=re.MULTILINE)

    # Headers: remove # mas mantém o texto
    text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)

    # Bold/italic
    text = re.sub(r'\*{1,3}([^*]+)\*{1,3}', r'\1', text)
    text = re.sub(r'_{1,3}([^_]+)_{1,3}', r'\1', text)

    # Links: [texto](url) → texto
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)

    # Imagens
    text = re.sub(r'!\[([^\]]*)\]\([^\)]+\)', '', text)

    # Blockquotes: remove >
    text = re.sub(r'^>\s*', '', text, flags=re.MULTILINE)

    # Separadores horizontais
    text = re.sub(r'^---+$', '', text, flags=re.MULTILINE)

    # HTML tags
    text = re.sub(r'<[^>]+>', '', text)

    # Múltiplas linhas em branco → uma
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Espaços múltiplos
    text = re.sub(r'  +', ' ', text)

    return text.strip()


def doc_slug(doc_path: str) -> str:
    return doc_path.replace('/', '__').replace('.md', '')


async def generate_audio(doc_path: str, force: bool = False) -> str:
    src  = DOCS_DIR / doc_path
    slug = doc_slug(doc_path)
    out  = AUDIO_DIR / f"{slug}.mp3"

    if out.exists() and not force:
        print(f"  [skip] {doc_path} (já existe — use --force para regenerar)")
        return slug

    if not src.exists():
        print(f"  [erro] {doc_path} não encontrado")
        return slug

    md   = src.read_text(encoding='utf-8')
    text = md_to_speech_text(md)

    if len(text) < 50:
        print(f"  [skip] {doc_path} (texto muito curto após limpeza)")
        return slug

    print(f"  [gerar] {doc_path} → {out.name}  ({len(text)} chars)")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
    await communicate.save(str(out))
    size_kb = out.stat().st_size // 1024
    print(f"         OK — {size_kb} KB")
    return slug


async def main():
    args = sys.argv[1:]

    if '--list-voices' in args:
        voices = await edge_tts.list_voices()
        pt_voices = [v for v in voices if v['Locale'].startswith('pt')]
        for v in pt_voices:
            print(f"  {v['ShortName']:40s} {v['Gender']:8s} {v['FriendlyName']}")
        return

    force = '--force' in args
    args  = [a for a in args if a != '--force']

    docs_to_process = args if args else DOCS

    AUDIO_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Voz: {VOICE} | Velocidade: {RATE} | Saída: {AUDIO_DIR}")
    print()

    audio_map = {}
    for doc in docs_to_process:
        slug = await generate_audio(doc, force=force)
        out  = AUDIO_DIR / f"{slug}.mp3"
        if out.exists():
            key = doc.removeprefix(DOCS_PREFIX)
            audio_map[key] = f"/audio/{slug}.mp3"

    AUDIO_MAP.write_text(json.dumps(audio_map, indent=2, ensure_ascii=False))
    print()
    print(f"audio-map.json atualizado: {len(audio_map)} entradas")


if __name__ == '__main__':
    asyncio.run(main())
