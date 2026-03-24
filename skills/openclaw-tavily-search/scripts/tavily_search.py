#!/usr/bin/env python3
"""
Tavily Search script for OpenClaw.
Search the web using Tavily API and output results in various formats.
"""

import os
import sys
import json
import argparse
import requests
from pathlib import Path
from typing import Optional, Dict, List, Any

DEFAULT_MAX_RESULTS = 5
TAVILY_API_URL = "https://api.tavily.com/search"


def load_api_key() -> Optional[str]:
    """Load API key from environment or .env file."""
    # 1. Environment variable
    key = os.environ.get("TAVILY_API_KEY")
    if key:
        return key.strip()

    # 2. ~/.openclaw/.env file
    env_path = Path.home() / ".openclaw" / ".env"
    if env_path.exists():
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("TAVILY_API_KEY="):
                        return line.split("=", 1)[1].strip()
        except Exception:
            pass

    return None


def search_tavily(
    query: str,
    api_key: str,
    max_results: int = DEFAULT_MAX_RESULTS,
    include_answer: bool = False,
    search_depth: str = "basic",
) -> Dict[str, Any]:
    """Call Tavily API and return raw response."""
    payload = {
        "api_key": api_key,
        "query": query,
        "max_results": max_results,
        "include_answer": include_answer,
        "search_depth": search_depth,
    }
    headers = {"Content-Type": "application/json"}

    try:
        resp = requests.post(TAVILY_API_URL, json=payload, headers=headers, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except requests.exceptions.RequestException as e:
        print(f"Tavily API error: {e}", file=sys.stderr)
        if hasattr(e, "response") and e.response:
            print(f"Response: {e.response.text}", file=sys.stderr)
        sys.exit(1)


def transform_to_brave_format(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Convert Tavily response to Brave-like schema."""
    result = {
        "query": raw.get("query", ""),
        "results": [],
        "answer": raw.get("answer") if raw.get("answer") else None,
    }
    for item in raw.get("results", []):
        result["results"].append({
            "title": item.get("title", ""),
            "url": item.get("url", ""),
            "snippet": item.get("content", ""),
        })
    return result


def format_markdown(results: List[Dict[str, Any]]) -> str:
    """Format results as compact Markdown list."""
    lines = []
    for idx, item in enumerate(results, 1):
        title = item.get("title", "").replace("\n", " ").strip()
        url = item.get("url", "").strip()
        snippet = item.get("snippet", "").replace("\n", " ").strip()
        lines.append(f"{idx}. **{title}**  \n   {url}  \n   {snippet}")
    return "\n\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Tavily search for OpenClaw")
    parser.add_argument("--query", required=True, help="Search query")
    parser.add_argument("--max-results", type=int, default=DEFAULT_MAX_RESULTS,
                        help=f"Maximum results (default: {DEFAULT_MAX_RESULTS})")
    parser.add_argument("--include-answer", action="store_true",
                        help="Include AI-generated answer if available")
    parser.add_argument("--format", choices=["raw", "brave", "md"], default="raw",
                        help="Output format (default: raw)")
    parser.add_argument("--api-key", help="Tavily API key (overrides env/file)")
    args = parser.parse_args()

    # Determine API key
    api_key = args.api_key
    if not api_key:
        api_key = load_api_key()
    if not api_key:
        print("ERROR: No Tavily API key provided.", file=sys.stderr)
        print("Set TAVILY_API_KEY environment variable or add to ~/.openclaw/.env", file=sys.stderr)
        sys.exit(1)

    # Perform search
    raw_response = search_tavily(
        query=args.query,
        api_key=api_key,
        max_results=args.max_results,
        include_answer=args.include_answer,
    )

    # Output based on format
    if args.format == "raw":
        print(json.dumps(raw_response, ensure_ascii=False, indent=2))
    elif args.format == "brave":
        brave = transform_to_brave_format(raw_response)
        print(json.dumps(brave, ensure_ascii=False, indent=2))
    elif args.format == "md":
        brave = transform_to_brave_format(raw_response)
        md = format_markdown(brave["results"])
        print(md)
        if brave.get("answer"):
            print(f"\n**Answer:** {brave['answer']}")


if __name__ == "__main__":
    main()