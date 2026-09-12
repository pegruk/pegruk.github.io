#!/usr/bin/env python3
"""Small command-line helper for creating, checking, and committing posts."""

from __future__ import annotations

import argparse
import re
import subprocess
import sys
import unicodedata
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
POSTS = ROOT / "src" / "posts"


def slugify(value: str) -> str:
    value = unicodedata.normalize("NFKD", value)
    value = "".join(char for char in value if not unicodedata.combining(char))
    return re.sub(r"-+", "-", re.sub(r"[^a-z0-9]+", "-", value.lower())).strip("-")


def title_from_name(name: str) -> str:
    stem = Path(name).stem
    words = re.sub(r"[_-]+", " ", stem).split()
    title = " ".join(words)
    return title[:1].upper() + title[1:]


def categories() -> list[str]:
    found: set[str] = set()
    for post in POSTS.glob("*.md"):
        text = post.read_text(encoding="utf-8")
        match = re.search(r"^categories:\s*\[([^]]*)\]", text, re.MULTILINE)
        if match:
            found.update(item.strip().strip("\"'") for item in match.group(1).split(",") if item.strip())
    return sorted(found, key=str.casefold)


def ask_category() -> str:
    existing = categories()
    print("Categorias existentes:")
    for index, category in enumerate(existing, 1):
        print(f"  {index}. {category}")
    if not existing:
        print("  (nenhuma)")

    category = input("Categoria do artigo: ").strip()
    while not category:
        category = input("A categoria não pode ficar vazia. Categoria: ").strip()
    canonical = next((item for item in existing if item.casefold() == category.casefold()), None)
    if canonical:
        return canonical
    if category.casefold() not in {item.casefold() for item in existing}:
        answer = input(f'"{category}" é uma categoria nova? [S/n] ').strip().lower()
        if answer not in ("", "s", "sim", "y", "yes"):
            print("Categoria cancelada.")
            raise SystemExit(1)
    return category


def create_post(name: str) -> None:
    slug = slugify(Path(name).stem)
    if not slug:
        raise SystemExit("O nome precisa conter letras ou números.")
    path = POSTS / f"{slug}.md"
    if path.exists():
        raise SystemExit(f"O artigo já existe: {path.relative_to(ROOT)}")
    category = ask_category()
    title = title_from_name(name)
    template = f"""---
title: {title}
date: {date.today().isoformat()}
categories: [{category}]
description: 
---

Escreva uma introdução curta para este artigo.

## Primeiro título

Comece a escrever aqui.
"""
    path.write_text(template, encoding="utf-8")
    print(f"Artigo criado em {path.relative_to(ROOT)}")


def run(command: list[str]) -> None:
    print(f"$ {' '.join(command)}")
    result = subprocess.run(command, cwd=ROOT)
    if result.returncode:
        raise SystemExit(result.returncode)


def publish() -> None:
    run(["npm", "run", "test:build"])
    run(["npm", "test"])
    run(["npm", "run", "build"])
    print("Verificação concluída. Revise o site em _site/ e depois use o comando commit.")


def commit(message: str) -> None:
    if not message.strip():
        raise SystemExit("Informe uma mensagem, por exemplo: content: add meu artigo")
    if not re.match(r"^(content|feat|fix|docs|chore|refactor|test):\s+", message):
        message = f"content: {message}"
    run(["git", "add", "-A"])
    subprocess.run(["git", "diff", "--cached", "--stat"], cwd=ROOT, check=True)
    answer = input("Criar este commit? [S/n] ").strip().lower()
    if answer not in ("", "s", "sim", "y", "yes"):
        raise SystemExit("Commit cancelado.")
    run(["git", "commit", "-m", message])


def main() -> None:
    parser = argparse.ArgumentParser(description="Ferramentas para manter o blog")
    commands = parser.add_subparsers(dest="command", required=True)
    create = commands.add_parser("create", help="cria um novo artigo")
    create.add_argument("name", help="nome ou título do artigo")
    commands.add_parser("publish", help="testa e gera o site estático")
    commit_parser = commands.add_parser("commit", help="revisa e cria um commit")
    commit_parser.add_argument("message", help="mensagem do commit")
    args = parser.parse_args()
    if args.command == "create":
        create_post(args.name)
    elif args.command == "publish":
        publish()
    else:
        commit(args.message)


if __name__ == "__main__":
    main()
